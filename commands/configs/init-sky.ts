#!/usr/bin/env -S pnpm exec bun
import child_process from 'child_process'
import fs from 'fs'
import path from 'path'
import { stdin, stdout } from 'process'
import readline from 'readline'

class ReadLineInterface extends readline.Interface {
    constructor() {
        super({
            input: stdin,
            output: stdout,
        })
    }

    askQuestion(question: string): Promise<null | string> {
        return new Promise(resolve => {
            this.question(question, answer => {
                if (answer == '') {
                    resolve(null)
                }

                resolve(answer)
            })
        })
    }
}

using rl = new ReadLineInterface()

const devPath = path.resolve('.dev')
const externalSkyModulesPath = (await rl.askQuestion('Path to sky-modules?\n\n')) || null
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
        `${externalSkyModulesPath}/commands/configs/.dev/package.json`,
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
    fs.writeFileSync(`.dev/package.json`, '{"name":"dev"}')
    fs.writeFileSync('.dev/modules.json', JSON.stringify({ sky: '.dev/sky-modules' }))
    run(`pnpm link ./sky-modules`, { cwd: devPath })
}

run(`pnpm link .dev/node_modules/sky`)
run(`pnpm sky init`)
