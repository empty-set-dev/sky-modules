import { readFileSync, writeFileSync, rmSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

import { ArgumentsCamelCase } from 'yargs'

import cliPath from './utilities/cliPath'
import { IGNORED_PATTERNS } from './utilities/pathHelpers'
import runShell from './utilities/run'
import workspaceRoot from './utilities/workspaceRoot'

function generateStrykerConfig(folder: string): string {
    if (workspaceRoot == null) {
        throw new Error('Sky workspace not found')
    }

    const sandboxDir = join(workspaceRoot, '.dev', '.stryker-tmp')

    if (existsSync(sandboxDir)) {
        rmSync(sandboxDir, { recursive: true, force: true })
    }

    mkdirSync(sandboxDir, { recursive: true })

    const baseConfig = JSON.parse(
        readFileSync(`${cliPath}/dev-configs/stryker.config.json`, 'utf-8')
    )

    const dynamicConfig = {
        ...baseConfig,
        testRunner: 'vitest',
        plugins: ['@stryker-mutator/vitest-runner'],
        ignorePatterns: IGNORED_PATTERNS,
        mutate: [
            `${folder}/**/*.js`,
            `${folder}/**/*.jsx`,
            `${folder}/**/*.ts`,
            `${folder}/**/*.tsx`,
            `!${folder}/**/*.test.*`,
            `!${folder}/**/*.spec.*`,
            `!${folder}/**/global.ts`,
        ],
        vitest: {
            configFile: `${cliPath}/dev-configs/vitest.config.js`,
            dir: folder,
            related: false,
        },
    }

    const tempConfigPath = join(sandboxDir, 'stryker.config.json')
    writeFileSync(tempConfigPath, JSON.stringify(dynamicConfig, null, 2))

    return tempConfigPath
}

async function runMutationTesting(folder: string): Promise<void> {
    if (folder !== '.') {
        const configPath = generateStrykerConfig(folder)
        await runShell(`stryker run ${configPath}`)
    } else {
        await runShell(`stryker run ${cliPath}/dev-configs/stryker.config.json`)
    }
}

export default async function test(
    argv: ArgumentsCamelCase<{ mutation?: boolean; watch?: boolean; folder: string }>
): Promise<void> {
    const folder = argv.folder ?? '.'

    if (argv.mutation) {
        await runMutationTesting(folder)
    } else {
        const watchFlag = argv.watch ? '--watch' : 'run'
        // Enable coverage only for specific folders (not '.' and not in watch mode)
        const coverageFlag = !argv.watch && folder !== '.' ? '--coverage.enabled=true' : ''
        await runShell(
            `vitest ${watchFlag} --config ${cliPath}/dev-configs/vitest.config.js ${coverageFlag} ${folder}`
        )
    }
}
