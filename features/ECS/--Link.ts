import { __ON_END, __ON_END_LIST } from './--'

export default abstract class __Link<R = void, A extends unknown[] = []> {
    private abstract: __Link<R, A>

    readonly end: Promise<Awaited<R>>

    constructor() {
        if (this.resolve) {
            return
        }

        ;[this.resolve, this.end] = promise()
    }

    in<G>(link: Link, group: G): this {
        if (!(group as { has }).has) {
            throw Error('not a group')
        }

        ;(group as { has }).has(link, this)

        return this
    }

    emit(event: string, ...args: unknown[]): void {
        if (this['___events'] && this['___events'][event]) {
            this['___events'][event].forEach(onEvent => onEvent(...args))
        }
    }

    protected ['resolve']: (value: Awaited<R>) => Awaited<R>

    private async [__ON_END](...args: [] | A): Promise<Awaited<R>>
    private async [__ON_END](): Promise<Awaited<R>> {
        if (!this[__ON_END_LIST]) {
            return
        }

        await Promise.all(this[__ON_END_LIST].map(onEnd => onEnd(false)))

        delete this[__ON_END_LIST]
    }

    private [__ON_END_LIST]?: ((...args: unknown[]) => unknown)[]
    private ['__events']?: Record<string, Function[]>
}
