#!/usr/bin/env -S pnpm exec tsx
import child_process from 'child_process'
import fs from 'fs'
import path from 'path'
import { argv } from 'process'

const devPath = path.resolve('.dev')
const externalSkyModulesPath = argv[2] ? path.resolve(argv[2]) : null
fs.mkdirSync(devPath, { recursive: true })

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

if (externalSkyModulesPath) {
    const skyModulesPath = path.join(devPath, 'node_modules/sky')
    run(`pnpm link ${path.relative(devPath, externalSkyModulesPath)}`, {
        cwd: devPath,
    })
    run(`pnpm link ${path.relative(process.cwd(), skyModulesPath)}`)
} else {
    const skyModulesPath = path.join(devPath, 'sky-modules')

    if (fs.existsSync(skyModulesPath)) {
        run('git pull', { cwd: skyModulesPath })
    } else {
        run('git clone https://github.com/empty-set-games/sky-modules', { cwd: devPath })
    }

    run('pnpm i', { cwd: skyModulesPath })
    run('npx sky init', { cwd: skyModulesPath })
    run(`pnpm link .dev/sky-modules`)
}

run(`npx sky init`)
