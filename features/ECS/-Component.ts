import './-Entity'
import globalify from 'helpers/globalify'

import { __SYSTEMS } from './__'

declare global {
    class Component<T = void, A extends unknown[] = []> extends Entity<T, A> {
        constructor(link: Link)
    }
}

class Component<T = void, A extends unknown[] = []> extends Entity<T, A> {
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

globalify({ Component })
