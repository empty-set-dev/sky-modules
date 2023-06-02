export type PromisesPoolTask = () => Promise<void>

export default class PromisesPool {
    constructor(count = 10) {
        this['__count'] = count
    }

    run!: (task: PromisesPoolTask) => Promise<void>
    wait!: () => Promise<void>

    private readonly __count: number
    private readonly __tasks: Promise<void>[] = []
    private __tasksCount = 0
    private readonly __queue: [PromisesPoolTask, Function][] = []
}

import './`PromisesPool/`PromisesPool+run'
import './`PromisesPool/`PromisesPool+wait'
