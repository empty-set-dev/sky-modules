namespace PromisesPool {
    export type Task<T extends unknown[]> = (...args: T) => Promise<void>
}
class PromisesPool {
    constructor(count = 10) {
        this['__count'] = count
    }

    run!: <T extends unknown[]>(task: Ns.Task<T>, ...args: T) => Promise<void>
    wait!: () => Promise<void>

    private readonly __count: number
    private readonly __tasks: Promise<void>[] = []
    private __tasksCount = 0
    private readonly __queue: [Ns.Task<unknown[]>, Function, unknown[]][] = []
}
import Ns = PromisesPool

export default PromisesPool
