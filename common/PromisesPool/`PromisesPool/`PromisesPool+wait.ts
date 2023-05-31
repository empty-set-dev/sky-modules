import PromisesPool from '../`PromisesPool'

PromisesPool.prototype.wait = async function wait(): Promise<void> {
    while (this['__tasks'].length) {
        await Promise.all(this['__tasks'])
    }
}
