import './-Entities'
import { _ON_END, _ON_END_LIST, _SYSTEMS } from './--'
import _Effects from './--Effects'
import _signalEnd from './--signalEnd'

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
                !(link instanceof _Effects) &&
                (link as { constructor }).constructor.isPure !== false
            ) {
                throw new Error('link missing')
            }

            if (!link[_ON_END_LIST]) {
                return
            }

            link[_ON_END_LIST] ??= []
            link[_ON_END_LIST].push(async (isSignalEnd: boolean) => {
                if (isSignalEnd) {
                    await _signalEnd.call(this)
                    return
                }

                return this.resolve(await this[_ON_END]())
            })

            this[_SYSTEMS] = link[_SYSTEMS]
        }
    }
}

Object.assign(global, module)
