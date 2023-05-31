import PromisesPool, { PromisesPoolTask } from '../`PromisesPool'

PromisesPool.prototype.run = async function run(
    this: PromisesPool,
    task: PromisesPoolTask
): Promise<void> {
    if (this['__tasksCount'] < this['__count']) {
        let inserted = false
        const promise = new Promise<void>(resolve => {
            ++this['__tasksCount']
            task().then(() => {
                --this['__tasksCount']
                if (inserted) {
                    this['__tasks'].splice(this['__tasks'].indexOf(promise), 1)
                } else {
                    inserted = true
                }
                if (this['__queue'].length) {
                    const [task, resolve_] = this['__queue'].shift()!
                    resolve_()
                    this.run(task)
                }
                resolve()
            })
        }).catch(error => {
            throw error
        })
        if (inserted) {
            return
        }
        inserted = true
        this['__tasks'].push(promise)
    } else {
        let resolve: Function
        const promise = new Promise(resolve_ => (resolve = resolve_))
        this['__queue'].push([task, resolve!])
        await promise
    }
}
