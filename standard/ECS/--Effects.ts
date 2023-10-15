import { _ON_END, _ON_END_LIST } from './--'

export default abstract class _Effects<R = void, A extends unknown[] = []> {
    private abstract: _Effects<R>

    readonly end: Promise<Awaited<R>>

    constructor() {
        if (this.resolve) {
            return
        }

        ;[this.resolve, this.end] = promise()
    }

    in<G>(link: Effects, group: G): this {
        if (!(group as { has }).has) {
            throw Error('not a group')
        }

        ;(group as { has }).has(link, this)

        return this
    }

    protected ['resolve']: (value: Awaited<R>) => Awaited<R>

    private async [_ON_END](...args: [] | A): Promise<Awaited<R>>
    private async [_ON_END](): Promise<Awaited<R>> {
        if (!this[_ON_END_LIST]) {
            return
        }

        for (let i = 0; i < this[_ON_END_LIST].length; i++) {
            await this[_ON_END_LIST][i](false)
        }

        delete this[_ON_END_LIST]
    }
}
