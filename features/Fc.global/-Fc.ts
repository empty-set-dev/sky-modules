import { _SYSTEMS } from 'features/ECS.global/--'
import globalify from 'utilities/globalify'

declare global {
    interface Fc {}
    const Fc: typeof module.Fc & Fc
}

function _addComponent(
    systems: Record<string, { constructor: { name; Components } }[]>,
    entity: Entity,
    name: string
): void {
    systems[name] &&
        systems[name].forEach(system => {
            Object.keys(system.constructor.Components).forEach(k => {
                const Components = system.constructor.Components[k]
                if (Components.every(Component => entity[Component.name])) {
                    system[k] ??= []
                    // TODO OPTIMIZE
                    if (!system[k].includes(entity)) {
                        const onAdd = `onAdd${k[0].toUpperCase() + k.slice(1)}`
                        system[k].push(entity)
                        system[onAdd] && system[onAdd](entity)
                    }
                }
            })
        })
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

            const supersMap: Record<string, unknown> = {}
            const supersFlags: boolean[] = []

            const isComponent = !!Super.find(Super => Super.name === 'Component')

            const traverse = (Super): void => {
                Super.forEach(Super => {
                    const isGood = !supersMap[Super.name]
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

        //@ts-ignore
        callSuper(...(args as unknown[]))
        function callSuper(self: unknown, link: Effects, Super: T, ...args): void {
            if (self['___superIndex'] == null) {
                self['___superIndex'] = -1
            }

            ++self['___superIndex']

            if (!superFlags[self['___superIndex']]) {
                if (self['___superIndex'] === superFlags.length - 1) {
                    delete self['___superIndex']
                }

                return
            }

            if (self['___superIndex'] === superFlags.length - 1) {
                delete self['___superIndex']
            }

            if (!self.constructor['___isComponent'] && Super['___isComponent']) {
                self[Super.name] = self
                _addComponent(link[_SYSTEMS], self as never, Super.name)
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
                        _addComponent(link[_SYSTEMS], link as never, self.constructor.name)
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
