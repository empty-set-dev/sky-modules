import { __SYSTEMS } from 'features/ECS/__'
import globalify from 'helpers/globalify'

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
            : R & { in<G>(link: Link, group: G): R extends void ? T : R }
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
            Super.forEach(Super => {
                const prototype = Object.getPrototypeOf(Super.prototype)
                const prototype2 = prototype ? Object.getPrototypeOf(prototype) : null
                const prototype3 = prototype2 ? Object.getPrototypeOf(prototype2) : null
                const prototype4 = prototype3 ? Object.getPrototypeOf(prototype3) : null

                prototype4 &&
                    Object.defineProperties(
                        Composition.prototype,
                        Object.getOwnPropertyDescriptors(prototype4)
                    )
                prototype3 &&
                    Object.defineProperties(
                        Composition.prototype,
                        Object.getOwnPropertyDescriptors(prototype3)
                    )
                prototype2 &&
                    Object.defineProperties(
                        Composition.prototype,
                        Object.getOwnPropertyDescriptors(prototype2)
                    )

                prototype &&
                    Object.defineProperties(
                        Composition.prototype,
                        Object.getOwnPropertyDescriptors(prototype)
                    )
            })

            const supersMap: Record<string, unknown> = {}
            const supersFlags: boolean[] = []

            const isComponent = !!Super.find(Super => Super.name === 'Component')

            const traverse = (Super): void => {
                Super.forEach(Super => {
                    const isGood = supersMap[Super.name] == null
                    supersFlags.push(isGood)
                    if (isGood) {
                        supersMap[Super.name] = Super
                        Super['___supers'] && traverse(Super['___supers'])
                    }
                })
            }

            traverse(Super)

            Composition['___isComponent'] = isComponent
            Composition['___supers'] = Object.keys(supersMap).map(k => supersMap[k])
            Composition['___supersFlags'] = supersFlags

            return Composition as never
        }

        const superFlags = args[0].constructor['___supersFlags']

        callSuper(...(args as unknown as [unknown, Link, T, ...unknown[]]))
        function callSuper(self: unknown, link: Link, Super: T, ...args): void {
            if (self['___superIndex'] == null) {
                self['___superIndex'] = -1
            }

            ++self['___superIndex']

            if (self['___superIndex'] === superFlags.length - 1) {
                delete self['___superIndex']
                return
            }

            while (!superFlags[self['___superIndex']]) {
                ++self['___superIndex']

                if (self['___superIndex'] === superFlags.length - 1) {
                    delete self['___superIndex']
                }

                return
            }

            if (!self.constructor['___isComponent'] && Super['___isComponent']) {
                self[Super.name] = self
                __addComponent(link[__SYSTEMS], self as never, Super.name)
            }

            if (
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

                    if (self.constructor['___isComponent'] && Super.name === 'Component') {
                        link[self.constructor.name] = self
                        __addComponent(link[__SYSTEMS], link as never, self.constructor.name)
                    }
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
        new (link: Link, ...args: A): R extends void ? T & Effect : R
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

function __addComponent(
    systems: Record<
        string,
        {
            constructor: {
                name: string
                Components: Entity[]
            }
        }[]
    >,
    entity: Entity,
    name: string
): void {
    if (!systems[name]) {
        return
    }

    systems[name].forEach(system => {
        Object.keys(system.constructor.Components).forEach(k => {
            const Components = system.constructor.Components[k]
            if (Components.every(Component => entity[Component.name])) {
                system[k] ??= []
                if (!system[k].includes(entity)) {
                    system[k].push(entity)
                    const onAdd = `onAdd${k[0].toUpperCase() + k.slice(1)}`
                    system[onAdd] && system[onAdd](entity)
                }
            }
        })
    })
}
