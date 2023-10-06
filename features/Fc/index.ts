import { globalify } from 'utilities'

import { getFunctionContext, FunctionContext } from '../function-contexts'

declare global {
    type Fc = typeof module.Fc
    const Fc: typeof module.Fc
}

const OriginalObject = Object
namespace module {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.createContext = function <T>(): FunctionContext<T> {
        return createFunctionContext()
    }

    Fc.pure = function Fc<T, R extends unknown[] = []>(
        Fc: (this: undefined, ...args: R) => void
    ): {
        new (...args: R): T
        prototype: T
    } {
        return create(Fc, true) as never
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.public = function (...Fc: unknown[]): void {
        //
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.destroy = function (destroy: () => void): void {
        this['___destroy'] = destroy
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.dispose = function (dispose: () => void): void {
        this['___dispose'] = dispose
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.get = function (get: (key: string | symbol) => unknown): void {
        this['___get'] = get
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.set = function (set: (key: string | symbol) => unknown): void {
        this['___set'] = set
    }

    Fc.context = function <T>(context: FunctionContext<T>): T {
        return getFunctionContext(context)
    }

    export function Fc<T, R extends unknown[] = []>(
        Fc: (this: undefined, ...args: R) => void
    ): {
        new (link: unknown, ...args: R): T
        prototype: T
    } {
        return create(Fc)
    }

    const create = <T, R extends unknown[]>(
        Fc: (this: undefined, ...args: R) => void,
        isPure = false
    ): {
        new (link: unknown, ...args: R): T
        prototype: T
    } => {
        function Object(link: unknown, ...args: unknown[]): void {
            if (!isPure && (link == null || typeof link !== 'object')) {
                throw Error('link missing')
            }

            const meta = OriginalObject.create(module.Fc)
            const [object, prototype] = Fc.call(meta, ...args)

            if (!isPure) {
                const destroy = meta['___destroy'] ?? meta['___dispose']
                prototype[meta.destroy ? 'destroy' : 'dispose'] = (): void => {
                    meta['___onEnd'] && meta['___onEnd'].forEach(onEnd => onEnd())
                    destroy && destroy()
                }

                if (meta['___destroy'] || meta['___dispose']) {
                    meta['___onEnd'].push(meta['___destroy'] ?? meta['___dispose'])
                }

                link['___onEnd'] ??= []
                link['___onEnd'].push(prototype.destroy ?? prototype.dispose)
            }

            OriginalObject.setPrototypeOf(prototype, Object.prototype)
            return OriginalObject.setPrototypeOf(object, prototype)
        }

        return Object as never
    }
}

globalify(module)
