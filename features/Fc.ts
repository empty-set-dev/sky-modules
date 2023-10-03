import { globalify } from 'utilities'

declare global {
    interface Fc {
        <T>(Fc: Function): {
            new (): T
            prototype: T
        }
        public(...Fc: unknown[]): void
    }
    const Fc: typeof module.Fc
}

namespace module {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.public = function (...Fc: unknown[]): void {
        //
    }

    export function Fc<T>(Fc: Function): {
        new (): T
        prototype: T
    } {
        const create = function (): void {
            const [object, prototype] = Fc()
            Object.setPrototypeOf(prototype, create.prototype)
            return Object.setPrototypeOf(object, prototype)
        }

        return create as never
    }
}

globalify(module)
