#!/usr/bin/env -S pnpm exec tsx
import child_process from 'child_process'
import path from 'path'

import { logConsole } from 'sky/helpers/console'

const skyModulesPath = path.join(process.cwd(), 'sky-modules')

interface RunParameters {
    cwd?: string
}
function run(command: string, parameters: RunParameters = {}): void {
    let { cwd } = parameters
    cwd ??= process.cwd()

    logConsole(command)
    child_process.execSync(command, {
        stdio: 'inherit',
        cwd,
    })
}

run('pnpm i')
run('git clone https://github.com/empty-set-games/SkyModules')
run('pnpm i', { cwd: skyModulesPath })
run('pnpm audit fix', { cwd: skyModulesPath })
run(`pnpm link ./sky-modules`)
