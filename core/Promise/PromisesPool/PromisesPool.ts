namespace PromisesPool {
    export type Task<T extends unknown[]> = (...args: T) => Promise<void>
}

class PromisesPool {
    private readonly maxCount: number
    private readonly tasks: Promise<void>[] = []
    private tasksCount = 0
    private readonly queue: [
        task: PromisesPool.Task<unknown[]>,
        args: unknown[],
        resolve: Function,
    ][] = []

    constructor(maxCount = 10) {
        this.maxCount = maxCount
    }

    run<A extends unknown[]>(task: PromisesPool.Task<A>, ...args: A): Promise<void> {
        task
        args
        return null!
    }

    wait(): Promise<void> {
        return null!
    }
}

export default PromisesPool
