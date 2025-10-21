import '@sky-modules/core/global'

import PromisePool from './PromisePool'

PromisePool.prototype.run = async function run<T extends unknown[]>(
    this: PromisePool,
    task: PromisePool.Task<T>,
    ...args: T
): Promise<void> {
    if (this['tasksCount'] < this['maxCount']) {
        ++this['tasksCount']

        const [promise, resolve] = Promise.new()
        this['tasks'].push(promise)

        fire(task, ...args).then(() => {
            --this['tasksCount']
            this['tasks'].remove(promise)

            if (this['queue'].length > 0) {
                const [task, args, resolve] = this['queue'].shift()!
                resolve()
                fire([this, this.run], task, ...args)
            }

            resolve()
        })

        return
    } else {
        const [promise, resolve] = Promise.new()

        this['queue'].push([task as PromisePool.Task<unknown[]>, args, resolve])

        await promise
    }
}
