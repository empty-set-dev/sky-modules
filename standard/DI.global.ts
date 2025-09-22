import globalify from 'sky/standard/globalify'

import * as lib from './DI'

declare global {
    const Singleton: typeof lib.Singleton
    const Injectable: typeof lib.Injectable
    const AutoInjectable: typeof lib.AutoInjectable
    const depends: typeof lib.depends
}

globalify(lib)

@Singleton
class Foo {
    x = Math.floor(Math.random() * 100) + 1

    get boo(): Boo {
        return lib.container.resolve(Boo)
    }

    constructor() {
        // console.log('Foo:', this.boo)

        setTimeout(() => {
            console.log('timeout Foo:', this.boo)
        })
    }
}

@Singleton
class Boo {
    y = Math.floor(Math.random() * 100) + 1

    readonly foo = lib.container.resolve(Foo)

    constructor() {
        Console.log('Boo:', this.foo)
    }
}

const some = new Boo()
console.log(some)
