import run from './_PromisesPool+run'
import wait from './_PromisesPool+wait'

namespace PromisesPool {
    export type Task<T extends unknown[]> = (...args: T) => Promise<void>
}

class PromisesPool {
    constructor(maxCount = 10) {
        this['__maxCount'] = maxCount
    }

    run<A extends unknown[]>(task: PromisesPool.Task<A>, ...args: A): Promise<void> {
        return run.call(this, task as never, ...args)
    }
    wait(): Promise<void> {
        return wait.call(this)
    }

    private readonly ['__maxCount']: number
    private readonly ['__tasks']: Promise<void>[] = []
    private ['__tasksCount'] = 0
    private readonly ['__queue']: [
        task: PromisesPool.Task<unknown[]>,
        args: unknown[],
        resolve: Function,
    ][] = []
}

export default PromisesPool
