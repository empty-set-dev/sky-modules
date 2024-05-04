import PromisesPool from './-PromisesPool'

export default async function wait(this: PromisesPool): Promise<void> {
    while (this['__tasks'].length > 0) {
        await Promise.all(this['__tasks'])
    }
}
