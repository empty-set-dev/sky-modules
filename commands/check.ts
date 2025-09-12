import run from './lib/run'
import skyPath from './lib/skyPath'

export default function format(): void {
    try {
        await run(`${skyPath}/node_modules/.bin/tsc`)
    } catch {
        //
    }
}
