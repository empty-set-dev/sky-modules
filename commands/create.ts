import { mkdirSync } from 'fs'
import { stdin, stdout } from 'process'
import readline from 'readline'

const askQuestion = (question: string, rl: readline.Interface): Promise<null | string> => {
    return new Promise(resolve => {
        rl.question(question, answer => {
            if (answer == '') {
                resolve(null)
            }

            resolve(answer)
        })
    })
}

export default async function create(): Promise<void> {
    using rl = readline.createInterface({
        input: stdin,
        output: stdout,
    })

    let projectTitle: undefined | string
    await askQuestion('Project title?\n', rl)

    while (projectTitle == null) {
        await askQuestion('', rl)
    }

    const defaultProjectName = projectTitle?.replaceAll(' ', '-').toLowerCase()
    const projectName =
        (await askQuestion(`Project name? (default: "${defaultProjectName}")`, rl)) ??
        defaultProjectName

    const projectPath =
        (await askQuestion(`Project path? (default: "${projectName}")\n`, rl)) ?? projectName

    mkdirSync(projectPath, { recursive: true })
}
