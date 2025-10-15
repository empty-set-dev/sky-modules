import fs, { mkdirSync } from 'fs'
import path from 'path'

import cliPath from './utilities/cliPath'
import ReadLineInterface from './utilities/ReadLineInterface'
import replaceFileVariables from './utilities/replaceFileVariables'

export default async function createWorkspaceConfig(): Promise<void> {
    if (fs.existsSync('.sky/sky.config.ts')) {
        Console.log('.sky/sky.config.ts already exists')
        return
    }

    const rl = new ReadLineInterface()

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
    fs.copyFileSync(path.join(cliPath, 'workspace-assets/sky.config.ts'), '.sky/sky.config.ts')
    replaceFileVariables('.sky/sky.config.ts', {
        PROJECT_TITLE: projectTitle,
        PROJECT_NAME: projectName,
    })
}
