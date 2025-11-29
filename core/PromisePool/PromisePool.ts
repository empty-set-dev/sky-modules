import '@sky-modules/core/global'

namespace PromisePool {
    export type Task<T extends unknown[]> = (...args: T) => Promise<void>
}

class PromisePool {
    private readonly maxCount: number
    private readonly tasks: Promise<void>[] = []
    private tasksCount = 0
    private readonly queue: [
        task: PromisePool.Task<unknown[]>,
        args: unknown[],
        resolve: Function,
    ][] = []

    constructor(maxCount = 10) {
        this.maxCount = maxCount
    }

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

    async wait(): Promise<void> {
        while (this.tasks.length > 0) {
            await Promise.all(this.tasks)
        }
    }
}

export default PromisePool
