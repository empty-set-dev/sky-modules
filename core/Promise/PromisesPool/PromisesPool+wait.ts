import PromisesPool from './PromisesPool'

PromisesPool.prototype.wait = async function wait(this: PromisesPool): Promise<void> {
    while (this['tasks'].length > 0) {
        await Promise.all(this['tasks'])
    }
}
