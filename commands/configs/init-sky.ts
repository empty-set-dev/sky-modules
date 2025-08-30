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
    const projectTitle = process.argv[2]
    const projectName = process.argv[3]

    if (!fs.existsSync('.dev/modules.json')) {
        fs.writeFileSync('.dev/modules.json', JSON.stringify({}))
    }

    const modules: Record<string, string> = JSON.parse(fs.readFileSync('.dev/modules.json', 'utf-8'))

    using rl = new ReadLineInterface()

    if (!fs.existsSync('.dev/package.json')) {
        fs.writeFileSync(`.dev/package.json`, JSON.stringify({ name: 'dev' }))
    }

    if (modules.sky == null) {
        const externalSkyModulesPath = (await rl.askQuestion('Path to sky-modules?\n')) || null

        if (externalSkyModulesPath == null) {
            const skyModulesPath = path.join('.dev', 'sky-modules')

            if (fs.existsSync(skyModulesPath)) {
                run('git pull', { cwd: skyModulesPath })
            } else {
                run('git clone https://github.com/empty-set-games/sky-modules', { cwd: '.dev' })
            }

            run('pnpm i', { cwd: skyModulesPath })
            run('pnpm sky init', { cwd: skyModulesPath })
        }

        run(`pnpm sky add ${externalSkyModulesPath ?? '.dev/sky-modules'}`)
    }
}

// } else {

// }

// run(`pnpm link .dev/node_modules/sky`)
// run(`pnpm sky init`)
