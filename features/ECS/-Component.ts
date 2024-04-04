import './-Entity'
import { __SYSTEMS } from './__'

declare global {
    class Component<R = void, A extends unknown[] = []> extends Entity<R, A> {
        constructor(link: Link)
    }
}

namespace module {
    export class Component<R = void, A extends unknown[] = []> extends Entity<R, A> {
        constructor(link: Link) {
            super(link)

            if (this.constructor.name === 'Component') {
                return
            }

            const { name } = this.constructor

            link[name] = this
        }

        private [__SYSTEMS]: Record<string, {}[]>
    }
}

Object.assign(global, module)
