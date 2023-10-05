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

const OriginalObject = Object
namespace module {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.public = function (...Fc: unknown[]): void {
        //
    }

    export function Fc<T>(Fc: Function): {
        new (): T
        prototype: T
    } {
        function Object(): void {
            const [object, prototype] = Fc()
            OriginalObject.setPrototypeOf(prototype, Object.prototype)
            return OriginalObject.setPrototypeOf(object, prototype)
        }

        return Object as never
    }
}

globalify(module)
