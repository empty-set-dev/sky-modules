import Console from 'sky/utilities/Console'

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

    Console.log(
        `mkdir -p ${projectPath}/.dev && curl -o ${projectPath}/.dev/init-sky.ts https://raw.githubusercontent.com/empty-set-games/sky-modules/refs/heads/main/commands/configs/init-sky.ts && cd ${projectPath} && pnpm init && pnpm i bun && pnpm bun run .dev/init-sky.ts`
    )
}
