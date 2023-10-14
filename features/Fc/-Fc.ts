import globalify from 'utilities/globalify'

import { createFunctionContext, getFunctionContext, FunctionContext } from './function-contexts'

declare global {
    type Fc = typeof module.Fc
    const Fc: typeof module.Fc

    function context<C, P = void>(
        component: (props: P) => ReactNode
    ): ((props: P) => ReactNode) & ReturnType<typeof Fc.createContext<C>>
}

namespace module {
    export function context<C, P = void>(
        component: (props: P) => ReactNode
    ): ((props: P) => ReactNode) & ReturnType<typeof Fc.createContext<C>> {
        Object.setPrototypeOf(Object.getPrototypeOf(component), Fc.createContext<C>())
        return component as never
    }

    Fc.createContext = function <T>(): FunctionContext<T> {
        return createFunctionContext()
    }

    Fc.context = function <T>(context: FunctionContext<T>): T {
        return getFunctionContext(context)
    }

    Fc.pure = function Fc<T, A extends unknown[] = [], R = void>(
        Fc: (...args: A) => R
    ): {
        new (...args: A): R extends void
            ? T
            : R & { in<G>(link: Effects, group: G): R extends void ? T : R }
        prototype: R extends void
            ? T
            : R & { in<G>(link: Effects, group: G): R extends void ? T : R }
    } {
        // eslint-disable-next-line prefer-rest-params
        return create(Fc as never, arguments[1], true) as never
    }

    const OriginalObject = Object

    Fc.extends = function <
        T extends { new (arg1?: A1, ...args: A): InstanceType<T> },
        A extends unknown[],
        A1
    >(SuperClass: T, ...args: A): InstanceType<T> {
        function Object(): Object {
            return this
        }

        if (Array.isArray(SuperClass)) {
            OriginalObject.assign(
                Object.prototype,
                ...SuperClass.map(SuperClass => SuperClass.prototype),
                {
                    ['___supers']: SuperClass.map(() => {
                        return function (self, link, SuperClass, ...args) {
                            if (
                                SuperClass instanceof Effect ||
                                SuperClass instanceof Entity ||
                                SuperClass.isPure === false
                            ) {
                                if (SuperClass['___constructor']) {
                                    SuperClass['___constructor'].call(self, link, ...args)
                                } else {
                                    const object = new SuperClass(link, ...args)
                                    OriginalObject.assign(self, object)
                                    OriginalObject.keys(object).forEach(k => {
                                        if (object[k] === object) {
                                            self[k] = self
                                        }
                                    })
                                }
                            } else {
                                if (SuperClass['___constructor']) {
                                    SuperClass['___constructor'].call(self, ...args)
                                } else {
                                    const object = new SuperClass(...args)
                                    OriginalObject.assign(self, object)
                                    OriginalObject.keys(object).forEach(k => {
                                        if (object[k] === object) {
                                            self[k] = self
                                        }
                                    })
                                }
                            }

                            return self
                        }
                    }),
                }
            )

            return Object as never
        }

        return args[0]['___supers'][SuperClass](...args)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.public = function (...Fc: unknown[]): void {
        //
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.protected = function (...Fc: unknown[]): void {
        //
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Fc.private = function (...Fc: unknown[]): void {
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
        prototype: R extends void ? T & Effect : R
    } {
        // eslint-disable-next-line prefer-rest-params
        return create(Fc, arguments[1], false)
    }

    const create = <T, A extends unknown[], R>(
        Fc: (...args: A) => R,
        isForwardNew = false,
        isPure = false
    ): {
        new (link: Effects, ...args: A): R extends void ? T & Effect : R
        prototype: R extends void ? T & Effect : R
    } => {
        if (isForwardNew) {
            const Object = function Object(...args: A): R {
                const object = Fc(...args)
                return ward(object)
            }
            return Object as never
        }

        function Object(link: Effects, ...args: unknown[]): void {
            if (!isPure && (link == null || typeof link !== 'object')) {
                throw Error('link missing')
            }

            Fc['___constructor'].call(this, link, ...args)

            // if (!isPure) {
            //     prototype[meta['___destroy'] ? 'destroy' : 'dispose'] =
            //         meta['___destroy'] ?? meta['___dispose']
            // } else {
            //     OriginalObject.setPrototypeOf(prototype, Effect.prototype)
            // }

            return this
        }
        OriginalObject.setPrototypeOf(Object, Fc)
        OriginalObject.setPrototypeOf(Object.prototype, Fc.prototype)
        Object.isPure = isPure

        return Object as never
    }
}

globalify(module)
