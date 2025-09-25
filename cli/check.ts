import run from './lib/run'
import skyPath from './lib/skyPath'

export default async function check(): Promise<void> {
    try {
        await run(`${skyPath}/node_modules/.bin/tsc --noEmit`)
    } catch {
        //
    }
}
