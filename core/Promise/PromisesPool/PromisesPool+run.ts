import '@sky-modules/core/global'

import PromisesPool from './PromisesPool'

PromisesPool.prototype.run = async function run<T extends unknown[]>(
    this: PromisesPool,
    task: PromisesPool.Task<T>,
    ...args: T
): Promise<void> {
    if (this['tasksCount'] < this['maxCount']) {
        let isInserted = false

        ++this['tasksCount']

        const [promise, resolve] = Promise.new()

        fire(task, ...args).then(() => {
            --this['tasksCount']

            if (isInserted) {
                this['tasks'].remove(promise)
            } else {
                isInserted = true
            }

            if (this['queue'].length > 0) {
                const [task, args, resolve] = this['queue'].shift()!
                resolve()
                fire([this, this.run], task, ...args)
            }

            resolve()
        })

        if (isInserted) {
            return
        }

        isInserted = true

        this['tasks'].push(promise)
    } else {
        const [promise, resolve] = Promise.new()

        this['queue'].push([task as PromisesPool.Task<unknown[]>, args, resolve])

        await promise
    }
}
