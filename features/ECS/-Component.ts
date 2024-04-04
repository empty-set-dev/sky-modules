import './-Entity'
import { _SYSTEMS } from './--'

declare global {
    class Component<R = void, A extends unknown[] = []> extends Entity<R, A> {
        constructor(link: Effects)
    }
}

namespace module {
    export class Component<R = void, A extends unknown[] = []> extends Entity<R, A> {
        constructor(link: Effects) {
            super(link)

            if (this.constructor.name === 'Component') {
                return
            }

            // TODO
            const name = this.constructor.name

            link[name] = this
        }

        private [_SYSTEMS]: Record<string, {}[]>
    }
}

Object.assign(global, module)
