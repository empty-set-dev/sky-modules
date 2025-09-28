import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

import { Argv, ArgumentsCamelCase } from 'yargs'

import Console from './utilities/Console'
import generateMitosisComponents from './utilities/generateMitosisComponents'

export default function mitosis(yargs: Argv): Argv {
    return yargs
        .command(
            'build',
            'Build mitosis components',
            () => null,
            async () => {
                try {
                    Console.log('🚀 Building mitosis components...')
                    await generateMitosisComponents()
                    Console.log('✅ Mitosis components built successfully')
                } catch (error) {
                    Console.error(`❌ Failed to build mitosis components: ${error}`)
                    process.exit(1)
                }
            }
        )
        .command(
            'watch',
            'Watch and rebuild mitosis components',
            () => null,
            async () => {
                try {
                    Console.log('👀 Starting mitosis watch mode...')

                    const mitosisProcess = spawn('mitosis', ['build', '--watch'], {
                        stdio: 'inherit',
                        shell: true
                    })

                    mitosisProcess.on('error', (error) => {
                        Console.error(`❌ Mitosis watch failed: ${error}`)
                        process.exit(1)
                    })

                    mitosisProcess.on('close', (code) => {
                        if (code !== 0) {
                            Console.error(`❌ Mitosis watch exited with code ${code}`)
                            process.exit(1)
                        }
                    })

                    // Handle graceful shutdown
                    process.on('SIGINT', () => {
                        Console.log('\n🛑 Stopping mitosis watch...')
                        mitosisProcess.kill('SIGINT')
                        process.exit(0)
                    })

                } catch (error) {
                    Console.error(`❌ Failed to start mitosis watch: ${error}`)
                    process.exit(1)
                }
            }
        )
        .command(
            'clean',
            'Clean generated components',
            () => null,
            async () => {
                try {
                    Console.log('🧹 Cleaning generated components...')

                    const outputDir = 'generated-components'
                    await fs.rm(outputDir, { recursive: true, force: true })
                    await fs.mkdir(outputDir, { recursive: true })

                    Console.log('✅ Generated components cleaned')
                } catch (error) {
                    Console.error(`❌ Failed to clean generated components: ${error}`)
                    process.exit(1)
                }
            }
        )
        .command(
            'dev',
            'Clean and start watch mode',
            () => null,
            async () => {
                try {
                    Console.log('🚀 Starting mitosis development mode...')

                    // Clean first
                    const outputDir = 'generated-components'
                    await fs.rm(outputDir, { recursive: true, force: true })
                    await fs.mkdir(outputDir, { recursive: true })
                    Console.log('🧹 Cleaned generated components')

                    // Then start watch
                    Console.log('👀 Starting watch mode...')
                    const mitosisProcess = spawn('mitosis', ['build', '--watch'], {
                        stdio: 'inherit',
                        shell: true
                    })

                    mitosisProcess.on('error', (error) => {
                        Console.error(`❌ Mitosis development mode failed: ${error}`)
                        process.exit(1)
                    })

                    mitosisProcess.on('close', (code) => {
                        if (code !== 0) {
                            Console.error(`❌ Mitosis development mode exited with code ${code}`)
                            process.exit(1)
                        }
                    })

                    // Handle graceful shutdown
                    process.on('SIGINT', () => {
                        Console.log('\n🛑 Stopping mitosis development mode...')
                        mitosisProcess.kill('SIGINT')
                        process.exit(0)
                    })

                } catch (error) {
                    Console.error(`❌ Failed to start mitosis development mode: ${error}`)
                    process.exit(1)
                }
            }
        )
        .completion('completion', 'Generate completion for terminal')
        .demandCommand()
        .help()
}