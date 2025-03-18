#!/usr/bin/env -S npx tsx
import child_process from 'child_process'
import path from 'path'

import { logConsole } from 'sky/helpers/console'

const modulesPath = path.join(process.cwd(), 'sky-modules')

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
run('pnpm i', { cwd: modulesPath })
run('pnpm audit fix', { cwd: modulesPath })
run('pnpm link .', { cwd: modulesPath })
