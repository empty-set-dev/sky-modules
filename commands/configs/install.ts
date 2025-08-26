#!/usr/bin/env -S pnpm exec bun
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
    fs.copyFileSync(
        `${externalSkyModulesPath}/_commands/configs/.dev/package.json`,
        `.dev/package.json`
    )
    fs.writeFileSync('.dev/modules.json', JSON.stringify({ sky: externalSkyModulesPath }))
    run(`pnpm link ${path.relative(devPath, externalSkyModulesPath)}`, {
        cwd: devPath,
    })
} else {
    const skyModulesPath = path.join(devPath, 'sky-modules')

    if (fs.existsSync(skyModulesPath)) {
        run('git pull', { cwd: skyModulesPath })
    } else {
        run('git clone https://github.com/empty-set-games/sky-modules', { cwd: devPath })
    }

    run('pnpm i', { cwd: skyModulesPath })
    run('npx sky init', { cwd: skyModulesPath })
    fs.copyFileSync(`.dev/sky-modules/_commands/configs/.dev/package.json`, `.dev/package.json`)
    fs.writeFileSync('.dev/modules.json', JSON.stringify({ sky: '.dev/sky-modules' }))
    run(`pnpm link ./sky-modules`, { cwd: devPath })
}

run(`pnpm link .dev/node_modules/sky`)
run(`npx sky init`)
