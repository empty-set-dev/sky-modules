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

            const { name } = this.constructor

            link[name] = this

            this[_SYSTEMS][name] &&
                this[_SYSTEMS][name].forEach(system => {
                    console.log(system.constructor.Components)
                })
        }

        private [_SYSTEMS]: [][]
    }
}

Object.assign(global, module)
