import PromisesPool from './-PromisesPool'

PromisesPool.prototype.run = async function run<T extends unknown[]>(
    this: PromisesPool,
    task: PromisesPool.Task<T>,
    ...args: T
): Promise<void> {
    if (this['__tasksCount'] < this['__maxCount']) {
        let isInserted = false

        ++this['__tasksCount']

        const [resolve, promise] = global.promise()

        task(...args).then(() => {
            --this['__tasksCount']
            if (isInserted) {
                this['__tasks'].splice(this['__tasks'].indexOf(promise), 1)
            } else {
                isInserted = true
            }

            if (this['__queue'].length > 0) {
                const [task, args, resolve] = this['__queue'].shift()
                resolve()
                this.run(task, ...args)
            }

            resolve()
        })

        if (isInserted) {
            return
        }

        isInserted = true

        this['__tasks'].push(promise)
    } else {
        const [resolve, promise] = global.promise()

        this['__queue'].push([task, args, resolve])

        await promise
    }
}
