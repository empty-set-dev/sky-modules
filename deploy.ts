#!/usr/bin/env -S npx tsx
import child_process from 'child_process'
import path from 'path'

import { logConsole } from './helpers/console'

const modulesPath = path.join(process.cwd(), 'modules')

interface RunOptions {
    cwd?: string
}
function run(command: string, options: RunOptions = {}): void {
    let { cwd } = options
    cwd ??= process.cwd()

    logConsole(command)
    child_process.execSync(command, {
        stdio: 'inherit',
        cwd,
    })
}

run('pnpm i')
run('git clone https://github.com/future-sky-one/SkyModules')
run('pnpm i', { cwd: modulesPath })
run('pnpm audit fix', { cwd: modulesPath })
run('pnpm link .', { cwd: modulesPath })
run('pnpm link ./SkyModules')
