#!/usr/bin/env -S pnpm exec bun
import child_process from 'child_process'
import fs from 'fs'
import path from 'path'

interface RunParameters {
    cwd?: string
}
function run(command: string, parameters: RunParameters = {}): void {
    let { cwd } = parameters
    cwd ??= process.cwd()

    // eslint-disable-next-line no-console
    console.log(command)
    child_process.execSync(command, {
        stdio: 'inherit',
        cwd,
    })
}

await initSky()

async function initSky(): Promise<void> {
    let externalSkyModulesPath: null | string = process.argv[2] || null

    if (!fs.existsSync('.dev/modules.json')) {
        fs.writeFileSync('.dev/modules.json', JSON.stringify({}))
    }

    if (!fs.existsSync('.dev/package.json')) {
        fs.writeFileSync(`.dev/package.json`, JSON.stringify({ name: 'dev' }))
    }

    if (externalSkyModulesPath == null) {
        const skyModulesPath = '.dev/sky-modules'

        if (fs.existsSync(skyModulesPath)) {
            run('git pull', { cwd: skyModulesPath })
        } else {
            run('git clone https://github.com/empty-set-games/sky-modules', { cwd: '.dev' })
        }

        run('pnpm i', { cwd: skyModulesPath })
        run('pnpm sky init', { cwd: skyModulesPath })
    }

    run(`pnpm sky add ${externalSkyModulesPath ?? '.dev/sky-modules'}`)
    run(`pnpm sky init`)
}
