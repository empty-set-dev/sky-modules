import _Effects from 'features/ECS.global/--Effects'
import globalify from 'utilities/globalify'

declare global {
    interface Fc {}
    const Fc: typeof module.Fc & Fc
}

namespace module {
    Fc.pure = function Fc<T, A extends unknown[] = [], R = void>(
        Fc: (...args: A) => R
    ): {
        isPure: true

        new (...args: A): R extends void
            ? T
            : R & { in<G>(link: Effects, group: G): R extends void ? T : R }
    } {
        // eslint-disable-next-line prefer-rest-params
        return create(Fc as never, arguments[1]) as never
    }

    type SkipFirst<T> = T extends [arg0: Effects, ...args: infer A] ? A : T

    Fc.super = function <T extends { new (...args: ConstructorParameters<T>): unknown }>(
        Super: T,
        ...args: T extends { isPure: true }
            ? ConstructorParameters<T>
            : SkipFirst<ConstructorParameters<T>>
    ): InstanceType<T> {
        function Composition(): Object {
            return this
        }

        if (Array.isArray(Super)) {
            Object.assign(Composition.prototype, ...Super.map(Super => Super.prototype))

            return Composition as never
        }

        //@ts-ignore
        callSuper(...(args as unknown[]))
        function callSuper(self: unknown, link: Effects, Super: T, ...args): void {
            if (
                Super.name === 'Component' ||
                Super.prototype instanceof Effect ||
                Super.prototype instanceof Entity ||
                (Super as never as { isPure }).isPure === false
            ) {
                if (Super['___constructor']) {
                    Super['___constructor'].call(self, link, ...(args as unknown[]))
                } else {
                    const object = new Super(link, ...(args as never))
                    Object.assign(self, object)
                    Object.keys(object).forEach(k => {
                        if (object[k] === object) {
                            self[k] = self
                        }
                    })
                }
            } else {
                if (Super['___constructor']) {
                    Super['___constructor'].call(self, ...(args as unknown[]))
                } else {
                    const object = new Super(...(args as ConstructorParameters<T>))
                    Object.assign(self, object)
                    Object.keys(object).forEach(k => {
                        if (object[k] === object) {
                            self[k] = self
                        }
                    })
                }
            }
        }

        return args[0]
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.public = function (...Fc: unknown[]): void {
        //
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.protected = function (...Fc: unknown[]): void {
        //
    }

    Fc.destroy = function (destroy: () => void): void {
        this['___destroy'] = destroy
    }

    Fc.dispose = function (dispose: () => void): void {
        this['___dispose'] = dispose
    }

    Fc.get = function (get: (key: string | symbol) => unknown): void {
        this['___get'] = get
    }

    Fc.set = function (set: (key: string | symbol) => unknown): void {
        this['___set'] = set
    }

    export function Fc<T, A extends unknown[] = [], R = void>(
        Fc: (...args: A) => R
    ): {
        new (link: Effects, ...args: A): R extends void ? T & Effect : R
    } {
        // eslint-disable-next-line prefer-rest-params
        return create(Fc, arguments[1])
    }

    const create = <T, A extends unknown[], R>(
        Fc: (...args: A) => R,
        isForwardNew = false
    ): {
        new (link: Effects, ...args: A): R extends void ? T & Effect : R
    } => {
        if (isForwardNew) {
            const Object = function Object(...args: A): R {
                const object = Fc(...args)
                return ward(object)
            }
            return Object as never
        }

        ;(Fc as never as { isPure }).isPure = false

        return Fc as never
    }
}

globalify(module)
