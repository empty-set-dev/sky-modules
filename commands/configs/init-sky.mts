#!/usr/bin/env -S pnpm exec tsx
import child_process from 'child_process'
import fs from 'fs'

const Console = console

interface RunParameters {
    cwd?: string
}
function run(command: string, parameters: RunParameters = {}): void {
    let { cwd } = parameters
    cwd ??= process.cwd()

    Console.log(command)
    child_process.execSync(command, {
        stdio: 'inherit',
        env: process.env,
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
        run(`pnpm i tsx`, { cwd: '.dev' })
    }

    if (externalSkyModulesPath == null) {
        externalSkyModulesPath = '.dev/sky-modules'

        if (fs.existsSync(externalSkyModulesPath)) {
            run('git pull', { cwd: externalSkyModulesPath })
        } else {
            run('git clone https://github.com/empty-set-games/sky-modules', { cwd: '.dev' })
        }

        run('pnpm i', { cwd: externalSkyModulesPath })
        run('pnpm sky init', { cwd: externalSkyModulesPath })
    }

    run(`pnpm sky add ${externalSkyModulesPath}`)
}
