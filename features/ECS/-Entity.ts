import './-Entities'
import Link from './-Link'
import { __ON_END, __ON_END_LIST, __SYSTEMS } from './__'

declare global {
    class Entity<R = void, A extends unknown[] = []> extends Entities<R, A> {
        readonly link

        constructor(link: Link)
    }
}

namespace module {
    export class Entity<R = void, A extends unknown[] = []> extends Entities<R, A> {
        readonly link

        constructor(link: Link) {
            super()

            if (!(link instanceof Link) && (link as { constructor }).constructor.fromFactory !== false) {
                throw new Error('link missing')
            }

            this.link = link

            if (!link[__ON_END_LIST]) {
                return
            }

            link[__ON_END_LIST].push(async (isSignalOnDestroy: boolean) => {
                if (isSignalOnDestroy) {
                    await __signalOnDestroy.call(this)
                    return
                }

                return this.resolve(await this[__ON_END]())
            })

            this[__SYSTEMS] = link[__SYSTEMS]
        }
    }
}

Object.assign(global, module)
