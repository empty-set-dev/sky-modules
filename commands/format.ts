import run from './lib/run'
import skyPath from './lib/skyPath'

export default function format(): void {
    run(
        `cross-env NODE_OPTIONS="--max-old-space-size=8192" ${skyPath}/node_modules/.bin/eslint --fix '**/*.{ts,tsx,js,jsx,mjs,cjs}'`
    )
}
