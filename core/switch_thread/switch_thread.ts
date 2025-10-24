export default function switch_thread(): Promise<void> {
    // Yield to event loop to allow other tasks to execute
    return Promise.resolve()
}

// Defer define call to avoid circular dependency
void Promise.resolve().then(async () => {
    const { default: define } = await import('../define')
    define('sky.core.switch_thread', switch_thread)
})
