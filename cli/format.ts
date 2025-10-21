import { ArgumentsCamelCase } from 'yargs'

import { CLI_CONSTANTS } from './constants'
import Console from './utilities/Console'
import run from './utilities/run'

const DEBUG = process.env.DEBUG === 'true'

export default async function format(argv: ArgumentsCamelCase<{ folder?: string }>): Promise<void> {
    try {
        await run(
            `cross-env NODE_OPTIONS="--max-old-space-size=${CLI_CONSTANTS.ESLINT_MAX_MEMORY_MB}"` +
                ` eslint --fix '${argv.folder ?? '.'}/**/*.{ts,tsx,js,jsx,mjs,cjs}'`
        )
    } catch (error) {
        if (DEBUG) {
            Console.error('ESLint failed:', error)
        }
        // Continue anyway - formatting is not critical
    }

    try {
        await run(`stylelint --fix '**/*.{css,scss}'`)
    } catch (error) {
        if (DEBUG) {
            Console.error('Stylelint failed:', error)
        }
        // Continue anyway - formatting is not critical
    }
}
