namespace PromisesPool {
    export type Task<T extends unknown[]> = (...args: T) => Promise<void>
}

class PromisesPool {
    private readonly __maxCount: number
    private readonly __tasks: Promise<void>[] = []
    private __tasksCount = 0
    private readonly __queue: [
        task: PromisesPool.Task<unknown[]>,
        args: unknown[],
        resolve: Function,
    ][] = []

    constructor(maxCount = 10) {
        this['__maxCount'] = maxCount
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
