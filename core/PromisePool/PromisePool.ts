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

    run<A extends unknown[]>(task: PromisePool.Task<A>, ...args: A): Promise<void> {
        throw new Error('PromisePool.run must be implemented via PromisePool+run.ts')
    }

    wait(): Promise<void> {
        throw new Error('PromisePool.wait must be implemented via PromisePool+wait.ts')
    }
}

export default PromisePool
