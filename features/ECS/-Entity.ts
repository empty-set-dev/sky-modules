import './-Entities'
import { __ON_END, __ON_END_LIST, __SYSTEMS } from './--'
import __Link from './--Link'
import __signalEnd from './--signalEnd'

declare global {
    class Entity<R = void, A extends unknown[] = []> extends Entities<R, A> {
        readonly link

        constructor(link: Effects)
    }
}

namespace module {
    export class Entity<R = void, A extends unknown[] = []> extends Entities<R, A> {
        readonly link

        constructor(link: Effects) {
            super()

            this.link = link

            if (
                !(link instanceof __Link) &&
                (link as { constructor }).constructor.isPure !== false
            ) {
                throw new Error('link missing')
            }

            if (!link[__ON_END_LIST]) {
                return
            }

            link[__ON_END_LIST].push(async (isSignalEnd: boolean) => {
                if (isSignalEnd) {
                    await __signalEnd.call(this)
                    return
                }

                return this.resolve(await this[__ON_END]())
            })

            this[__SYSTEMS] = link[__SYSTEMS]
        }
    }
}

Object.assign(global, module)
