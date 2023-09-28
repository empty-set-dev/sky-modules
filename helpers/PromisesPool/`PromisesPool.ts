export type PromisesPoolTask<T extends unknown[]> = (...args: T) => Promise<void>

export default class PromisesPool {
    constructor(count = 10) {
        this['__count'] = count
    }

    run!: <T extends unknown[]>(task: PromisesPoolTask<T>, ...args: T) => Promise<void>
    wait!: () => Promise<void>

    private readonly __count: number
    private readonly __tasks: Promise<void>[] = []
    private __tasksCount = 0
    private readonly __queue: [PromisesPoolTask<unknown[]>, Function, unknown[]][] = []
}
