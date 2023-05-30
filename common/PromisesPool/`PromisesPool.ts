export type PromisesPoolTask = () => Promise<void>

export default class PromisesPool {
    constructor(private readonly __count = 10) {}

    async run(task: PromisesPoolTask): Promise<void> {
        if (this.__tasksCount < this.__count) {
            let inserted = false
            const promise = new Promise<void>(resolve => {
                ++this.__tasksCount
                task().then(() => {
                    --this.__tasksCount
                    if (inserted) {
                        this.__tasks.splice(this.__tasks.indexOf(promise), 1)
                    } else {
                        inserted = true
                    }
                    if (this.__queue.length) {
                        const [task, resolve_] = this.__queue.shift()!
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
            this.__tasks.push(promise)
        } else {
            let resolve: Function
            const promise = new Promise(resolve_ => (resolve = resolve_))
            this.__queue.push([task, resolve!])
            await promise
        }
    }

    async wait(): Promise<void> {
        while (this.__tasks.length) {
            await Promise.all(this.__tasks)
        }
    }

    private readonly __tasks: Promise<void>[] = []
    private __tasksCount = 0
    private readonly __queue: [PromisesPoolTask, Function][] = []
}
