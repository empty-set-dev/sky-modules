import PromisePool from './PromisePool'

PromisePool.prototype.wait = async function wait(this: PromisePool): Promise<void> {
    while (this['tasks'].length > 0) {
        await Promise.all(this['tasks'])
    }
}
