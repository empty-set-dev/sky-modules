import { _ON_END, _ON_END_LIST } from './--'

export default abstract class _Effects<R = void, A extends unknown[] = []> {
    private abstract: _Effects<R, A>

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

        Promise.all(this[_ON_END_LIST].map(onEnd => onEnd(false)))

        delete this[_ON_END_LIST]
    }

    private [_ON_END_LIST]?: ((...args: unknown[]) => unknown)[]
}
