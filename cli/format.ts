import run from './utilities/run'
import skyPath from './utilities/skyPath'

export default async function format(): Promise<void> {
    try {
        await run(
            `cross-env NODE_OPTIONS="--max-old-space-size=8192" ${skyPath}/node_modules/.bin/eslint --fix '**/*.{ts,tsx,js,jsx,mjs,cjs}'`
        )
    } catch {
        //
    }

    try {
        await run(`${skyPath}/node_modules/.bin/stylelint --fix '**/*.{css,scss}'`)
    } catch {
        //
    }
}
