export type PromisesPoolTask = () => Promise<void>

export default class PromisesPool {
    constructor(private readonly __count = 10) {}

    run!: (task: PromisesPoolTask) => Promise<void>
    wait!: () => Promise<void>

    private readonly __tasks: Promise<void>[] = []
    private __tasksCount = 0
    private readonly __queue: [PromisesPoolTask, Function][] = []
}

import './`PromisesPool/`PromisesPool+run'
import './`PromisesPool/`PromisesPool+wait'
