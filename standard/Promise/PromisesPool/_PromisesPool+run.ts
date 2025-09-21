import 'sky/standard/global'

import PromisesPool from './_PromisesPool'

PromisesPool.prototype.run = async function run<T extends unknown[]>(
    this: PromisesPool,
    task: PromisesPool.Task<T>,
    ...args: T
): Promise<void> {
    if (this['__tasksCount'] < this['__maxCount']) {
        let isInserted = false

        ++this['__tasksCount']

        const [promise, resolve] = Promise.new()

        task(task, ...args).then(() => {
            --this['__tasksCount']

            if (isInserted) {
                this['__tasks'].remove(promise)
            } else {
                isInserted = true
            }

            if (this['__queue'].length > 0) {
                const [task, args, resolve] = this['__queue'].shift()!
                resolve()
                task(this, this.run, task, ...args)
            }

            resolve()
        })

        if (isInserted) {
            return
        }

        isInserted = true

        this['__tasks'].push(promise)
    } else {
        const [promise, resolve] = Promise.new()

        this['__queue'].push([task as PromisesPool.Task<unknown[]>, args, resolve])

        await promise
    }
}
