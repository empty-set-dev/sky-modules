import { _ON_END, _ON_END_LIST } from './--'
import _signalEnd from './--signalEnd'

declare global {
    class Entity<R = void, A extends unknown[] = []> extends Entities<R, A> {
        constructor(link: Effects)
    }
}

namespace module {
    export class Entity<R = void, A extends unknown[] = []> extends Entities<R, A> {
        constructor(link: Effects) {
            super()

            if (link[_ON_END_LIST]) {
                return
            }

            link[_ON_END_LIST] = []
            link[_ON_END_LIST].push(async (isSignalEnd: boolean) => {
                if (isSignalEnd) {
                    await _signalEnd.call(this)
                    return
                }

                return this.resolve(await this[_ON_END]())
            })
        }
    }
}

Object.assign(global, module)
