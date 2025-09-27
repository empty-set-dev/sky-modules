import { ArgumentsCamelCase } from 'yargs'
import { readFileSync, writeFileSync, rmSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import runShell from './lib/run'
import skyPath from './lib/skyPath'

function generateStrykerConfig(folder: string): string {
    const sandboxDir = '.dev/.stryker-tmp'

    if (existsSync(sandboxDir)) {
        rmSync(sandboxDir, { recursive: true, force: true })
    }

    mkdirSync(sandboxDir, { recursive: true })

    const baseConfig = JSON.parse(
        readFileSync(`${skyPath}/cli/configs/stryker.config.json`, 'utf-8')
    )

    const dynamicConfig = {
        ...baseConfig,
        testRunner: 'vitest',
        plugins: ['@stryker-mutator/vitest-runner'],
        ignorePatterns: [
            "**/node_modules/**",
            "**/.dev/**",
            "**/boilerplates/**"
        ],
        mutate: [
            `${folder}/**/*.js`,
            `${folder}/**/*.jsx`,
            `${folder}/**/*.ts`,
            `${folder}/**/*.tsx`,
            `!${folder}/**/*.test.*`,
            `!${folder}/**/*.spec.*`,
            `!${folder}/**/global.ts`
        ],
        vitest: {
            configFile: `${skyPath}/cli/configs/vitest.config.js`,
            dir: folder,
            related: false,
        },
    }

    const tempConfigPath = join(skyPath, '.dev', '.stryker-tmp/stryker.config.json')
    writeFileSync(tempConfigPath, JSON.stringify(dynamicConfig, null, 2))

    return tempConfigPath
}

async function runMutationTesting(folder: string): Promise<void> {
    if (folder !== '.') {
        const configPath = generateStrykerConfig(folder)
        await runShell(
            `${skyPath}/node_modules/.bin/stryker run ${configPath}`
        )
    } else {
        await runShell(
            `${skyPath}/node_modules/.bin/stryker run ${skyPath}/cli/configs/stryker.config.json`
        )
    }
}

export default async function test(
    argv: ArgumentsCamelCase<{ mutation?: boolean; folder: string }>
): Promise<void> {
    const folder = argv.folder ?? '.'

    if (argv.mutation) {
        await runMutationTesting(folder)
    } else {
        await runShell(
            `${skyPath}/node_modules/.bin/vitest run --config ${skyPath}/cli/configs/vitest.config.js ${folder}`
        )
    }
}
