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
            Object.assign(Composition.prototype, ...Super.map(Super => Super.prototype), {
                ['___supers']: Super.map(() => {
                    return function (self, link, Super, ...args) {
                        if (
                            Super instanceof Effect ||
                            Super instanceof Entity ||
                            Super.isPure === false
                        ) {
                            if (Super['___constructor']) {
                                Super['___constructor'].call(self, link, ...args)
                            } else {
                                const object = new Super(link, ...args)
                                Object.assign(self, object)
                                Object.keys(object).forEach(k => {
                                    if (object[k] === object) {
                                        self[k] = self
                                    }
                                })
                            }
                        } else {
                            if (Super['___constructor']) {
                                Super['___constructor'].call(self, ...args)
                            } else {
                                const object = new Super(...args)
                                Object.assign(self, object)
                                Object.keys(object).forEach(k => {
                                    if (object[k] === object) {
                                        self[k] = self
                                    }
                                })
                            }
                        }

                        return self
                    }
                }),
            })

            return Composition as never
        }

        return args[0]['___supers'][Super](...(args as unknown[]))
    }

    Fc.use = (<T extends { new (...args: ConstructorParameters<T>): unknown }>(
        link: Effects,
        Component: T,
        ...args: T extends { isPure: true }
            ? ConstructorParameters<T>
            : SkipFirst<ConstructorParameters<T>>
    ): InstanceType<T> => {
        return new Component(...(args as never)) as never
    }) as never as <T extends { new (...args: ConstructorParameters<T>): unknown }>(
        link: Effects,
        Component: T,
        ...args: T extends { isPure: true }
            ? ConstructorParameters<T>
            : SkipFirst<ConstructorParameters<T>>
    ) => InstanceType<T>

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

        return Fc as never
    }
}

globalify(module)
