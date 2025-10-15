import { ArgumentsCamelCase } from 'yargs'

import run from './utilities/run'

export default async function format(argv: ArgumentsCamelCase<{ folder?: string }>): Promise<void> {
    try {
        await run(
            `cross-env NODE_OPTIONS="--max-old-space-size=8192"` +
                ` eslint --fix '${argv.folder ?? '.'}/**/*.{ts,tsx,js,jsx,mjs,cjs}'`
        )
    } catch {
        //
    }

    try {
        await run(`stylelint --fix '**/*.{css,scss}'`)
    } catch {
        //
    }
}
