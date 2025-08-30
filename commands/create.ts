import fs, { mkdirSync } from 'fs'
import path from 'path'

import ReadLineInterface from './lib/ReadLineInterface'
import replaceFileVariables from './lib/replaceFileVariables'
import run from './lib/run'
import skyPath from './lib/skyPath'

export default async function create(): Promise<void> {
    if (!fs.existsSync('.sky/sky.config.ts')) {
        using rl = new ReadLineInterface()

        let projectTitle: null | string = null
        projectTitle = await rl.askQuestion('Project title?\n')

        while (projectTitle == null) {
            projectTitle = await rl.askQuestion('')
        }

        const defaultProjectName = projectTitle?.replaceAll(' ', '-').toLowerCase()
        const projectName =
            (await rl.askQuestion(`Project name? (default: "${defaultProjectName}")\n`)) ??
            defaultProjectName

        mkdirSync('.sky', { recursive: true })
        fs.copyFileSync(path.join(skyPath, 'commands/configs/sky.config.ts'), '.sky/sky.config.ts')
        replaceFileVariables('.sky/sky.config.ts', {
            PROJECT_TITLE: projectTitle,
            PROJECT_NAME: projectName,
        })
    }

    fs.mkdirSync(`.dev`, { recursive: true })
    fs.copyFileSync(path.join(skyPath, 'commands/configs/init-sky.mts'), '.dev/init-sky.mts')
    run(`pnpm bun run .dev/init-sky ${path.resolve(skyPath)}`, {
        env: process.env,
        cwd: process.cwd(),
    })
}
