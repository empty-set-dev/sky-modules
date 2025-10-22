import define from '../define'

define('sky.core.switch_thread', switch_thread)
export default async function switch_thread(): Promise<void> {
    // Yield to event loop to allow other tasks to execute
    await Promise.resolve()
}
