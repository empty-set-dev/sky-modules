// Generate index.ts, global.ts, and .global.ts files (all-in-one)
import { ArgumentsCamelCase } from 'yargs'

import { ExitCode } from './constants'
import Console from './utilities/Console'
import { getSeparateModules } from './utilities/generateHelpers'

// Import the individual commands
import generateGlobalFilesCommand from './generate--global-files'
import generateGlobalCommand from './generate--global'
import generateIndexCommand from './generate--index'

export default async function generateMetaCommand(
    argv: ArgumentsCamelCase<{ path: string }>
): Promise<void> {
    try {
        Console.log(`🔨 Running meta generation for ${argv.path}`)
        Console.log(``)

        // Step 1: Generate .global.ts files
        Console.log(`📝 Step 1/3: Generating .global.ts files`)
        await generateGlobalFilesCommand(argv)
        Console.log(``)

        // Step 2: Generate index.ts files
        Console.log(`📝 Step 2/3: Generating index.ts files`)
        await generateIndexCommand({ ...argv, recursive: true })
        Console.log(``)

        // Step 3: Generate global.ts files
        Console.log(`📝 Step 3/3: Generating global.ts files`)
        await generateGlobalCommand({ ...argv, recursive: true })
        Console.log(``)

        Console.log(`✅ Completed meta generation`)
    } catch (error) {
        Console.error(`❌ Failed meta generation: ${error}`)
        process.exit(ExitCode.BUILD_ERROR)
    }
}
