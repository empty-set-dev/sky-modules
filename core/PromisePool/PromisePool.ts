import '@sky-modules/core/global'

namespace PromisePool {
    /**
     * Async task that can be executed by the pool
     */
    export type Task<T extends unknown[]> = (...args: T) => Promise<void>
}

/**
 * Concurrency pool for managing parallel async operations
 *
 * Limits the number of concurrent promises, queuing additional tasks
 * until capacity becomes available. Useful for:
 * - Rate limiting API calls
 * - Controlling parallel file operations
 * - Managing resource-intensive tasks
 *
 * @example
 * ```typescript
 * // Limit to 3 concurrent requests
 * const pool = new PromisePool(3)
 *
 * const urls = ['url1', 'url2', 'url3', 'url4', 'url5']
 *
 * // Only 3 will run at once, others queued
 * await Promise.all(
 *   urls.map(url => pool.run(async () => {
 *     const response = await fetch(url)
 *     return response.json()
 *   }))
 * )
 *
 * // Wait for all tasks to complete
 * await pool.wait()
 * ```
 */
class PromisePool {
    private readonly maxCount: number
    private readonly tasks: Promise<void>[] = []
    private tasksCount = 0
    private readonly queue: [
        task: PromisePool.Task<unknown[]>,
        args: unknown[],
        resolve: Function,
    ][] = []

    /**
     * Create a new PromisePool
     *
     * @param maxCount - Maximum number of concurrent tasks (default: 10)
     */
    constructor(maxCount = 10) {
        this.maxCount = maxCount
    }

    /**
     * Run a task in the pool
     *
     * If capacity is available, executes immediately. Otherwise, queues
     * the task until a slot opens up.
     *
     * @example
     * ```typescript
     * await pool.run(async (id) => {
     *   await processItem(id)
     * }, itemId)
     * ```
     *
     * @template A - Task argument types
     * @param task - Async function to execute
     * @param args - Arguments to pass to the task
     * @returns Promise resolving when task starts (not when it completes)
     */
    async run<A extends unknown[]>(task: PromisePool.Task<A>, ...args: A): Promise<void> {
        if (this.tasksCount < this.maxCount) {
            ++this.tasksCount

            let resolveTask: () => void
            const promise = new Promise<void>(resolve => {
                resolveTask = resolve
            })
            this.tasks.push(promise)

            fire(task, ...args).then(() => {
                --this.tasksCount
                this.tasks.remove(promise)

                if (this.queue.length > 0) {
                    const [task, args, resolve] = this.queue.shift()!
                    resolve()
                    fire([this, this.run], task, ...args)
                }

                resolveTask()
            })

            return
        } else {
            let resolveQueue: () => void
            const promise = new Promise<void>(resolve => {
                resolveQueue = resolve
            })

            this.queue.push([task as PromisePool.Task<unknown[]>, args, resolveQueue!])

            await promise
        }
    }

    /**
     * Wait for all running tasks to complete
     *
     * @example
     * ```typescript
     * // Start tasks
     * for (const item of items) {
     *   pool.run(async () => await process(item))
     * }
     *
     * // Wait for all to finish
     * await pool.wait()
     * console.log('All tasks complete')
     * ```
     *
     * @returns Promise resolving when all tasks are done
     */
    async wait(): Promise<void> {
        while (this.tasks.length > 0) {
            await Promise.all(this.tasks)
        }
    }
}

export default PromisePool
