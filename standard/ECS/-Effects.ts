import { ON_END, ON_END_LIST } from './-'

export {}

declare global {
    interface Effects extends module.Effects {}
}

namespace module {
    export abstract class Effects<R = void, A extends unknown[] = []> {
        private abstract: Effects<R>

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

        protected resolve: (value: Awaited<R>) => Awaited<R>

        private async [ON_END](...args: [] | A): Promise<Awaited<R>>
        private async [ON_END](): Promise<Awaited<R>> {
            if (!this[ON_END_LIST]) {
                return
            }

            for (let i = 0; i < this[ON_END_LIST].length; i++) {
                await this[ON_END_LIST][i](false)
            }

            delete this[ON_END_LIST]
        }
    }
}
Object.assign(global, module)
