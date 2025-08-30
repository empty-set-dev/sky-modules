import fs from 'fs'

import ReadLineInterface from './lib/ReadLineInterface'

export default async function create(): Promise<void> {
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

    const projectPath =
        (await rl.askQuestion(`Project path? (default: "${projectName}")\n`)) ?? projectName

    Console.log

    // mkdirSync(projectPath, { recursive: true })
    // run('pnpm sky init sky-config', {
    //     cwd: path.resolve(path.join(process.cwd(), projectPath)),
    // })
    // run('pnpm sky init', {
    //     cwd: path.resolve(projectPath),
    // })
}
