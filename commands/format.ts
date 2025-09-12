import run from './lib/run'
import skyPath from './lib/skyPath'

export default function format(): void {
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
