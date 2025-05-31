#!/usr/bin/env -S pnpm exec tsx
import child_process from 'child_process'
import path from 'path'

const skyModulesPath = path.join(process.cwd(), 'sky-modules')

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

run('pnpm i')
run('git clone https://github.com/empty-set-games/sky-modules')
run('pnpm i', { cwd: skyModulesPath })
run(`pnpm link ./sky-modules`)
