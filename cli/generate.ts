import { writeFileSync } from 'fs'
import path from 'path'

import { Argv, ArgumentsCamelCase } from 'yargs'

import { ExitCode } from './constants'
import Console from './utilities/Console'
import generateGlobal from './utilities/generateGlobal'
import generateIndex from './utilities/generateIndex'

export default function generate(yargs: Argv): Argv {
    return yargs
        .command(
            'index <path>',
            'Generate index.ts file',
            yargs =>
                yargs.positional('path', {
                    describe: 'Path to module or slice',
                    type: 'string',
                    demandOption: true,
                }),
            async (argv: ArgumentsCamelCase<{ path: string }>) => {
                try {
                    Console.log(`🔨 Generating index.ts for ${argv.path}`)

                    const indexContent = generateIndex(argv.path)
                    const indexPath = path.join(argv.path, 'index.ts')

                    writeFileSync(indexPath, indexContent)

                    Console.log(`✅ Generated index.ts for ${argv.path}`)
                } catch (error) {
                    Console.error(`❌ Failed to generate index.ts: ${error}`)
                    process.exit(ExitCode.BUILD_ERROR)
                }
            }
        )
        .command(
            'global <path>',
            'Generate global.ts file',
            yargs =>
                yargs.positional('path', {
                    describe: 'Path to module or slice',
                    type: 'string',
                    demandOption: true,
                }),
            async (argv: ArgumentsCamelCase<{ path: string }>) => {
                try {
                    Console.log(`🔨 Generating global.ts for ${argv.path}`)

                    const globalContent = generateGlobal(argv.path)
                    const globalPath = path.join(argv.path, 'global.ts')

                    writeFileSync(globalPath, globalContent)

                    Console.log(`✅ Generated global.ts for ${argv.path}`)
                } catch (error) {
                    Console.error(`❌ Failed to generate global.ts: ${error}`)
                    process.exit(ExitCode.BUILD_ERROR)
                }
            }
        )
        .completion('completion', 'Generate completion for terminal')
        .demandCommand()
        .help()
}
