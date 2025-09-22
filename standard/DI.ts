import 'reflect-metadata'

iAm('sky.standard.DI', import('./DI'))

declare global {
    interface Modules {
        'sky.standard.DI': typeof import('./DI')
    }
}

export * from 'tsyringe'
import { container, delay, inject, autoInjectable, injectable, singleton } from 'tsyringe'



@injectable()
class Foo {
    y = 42
    get boo(): Boo {
        return container.resolve(Boo)
    }
}

class Boo {
    x = Math.random()
    foo = container.resolve(Foo)
}

const boo = new Foo()
console.log(boo.boo.x, boo.boo.x)
