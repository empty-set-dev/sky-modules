import { spawn } from 'child_process'
import { execSync } from 'child_process'

import Console from './Console'

export default async function generateComponents(): Promise<void> {
    return new Promise((resolve, reject) => {
        Console.log('🚀 Generating universal components using mitosis CLI...')

        const mitosisProcess = spawn('mitosis', ['build'], {
            stdio: 'inherit',
            shell: true,
        })

        mitosisProcess.on('error', error => {
            Console.error(`❌ Mitosis build failed: ${error}`)
            reject(error)
        })

        mitosisProcess.on('close', code => {
            if (code !== 0) {
                const error = new Error(`Mitosis build exited with code ${code}`)
                Console.error(`❌ Mitosis build failed with code ${code}`)
                reject(error)
            } else {
                Console.log('✅ Mitosis components generated successfully!')

                // Compile TypeScript files to JS and generate .d.ts files
                try {
                    Console.log('🔨 Compiling TypeScript files...')
                    execSync(
                        'find generated-components -name "*.ts" -o -name "*.tsx" | xargs npx tsc --declaration --skipLibCheck --allowJs',
                        {
                            stdio: 'inherit',
                        }
                    )
                    Console.log('✅ TypeScript compilation completed!')
                    resolve()
                } catch (error) {
                    Console.error(`❌ TypeScript compilation failed: ${error}`)
                    reject(error)
                }
            }
        })
    })
}
