define('sky.core.switch_thread', switch_thread)
export default function switch_thread(): Promise<void> {
    // Yield to event loop to allow other tasks to execute
    return Promise.resolve()
}
