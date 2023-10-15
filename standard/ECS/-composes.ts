export {}

declare global {
    function composes<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(
        Super1: { prototype: T1 },
        Super2?: { prototype: T2 },
        Super3?: { prototype: T3 },
        Super4?: { prototype: T4 },
        Super5?: T5,
        Super6?: T6,
        Super7?: T7,
        Super8?: T8,
        Super9?: T9,
        Super10?: T10,
        Super11?: T11,
        Super12?: T12,
        Super13?: T13,
        Super14?: T14,
        Super15?: T15,
        Super16?: T16
    ): Intersection<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>
}

namespace module {
    export function composes<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(
        Super1: { prototype: T1 },
        Super2?: { prototype: T2 },
        Super3?: { prototype: T3 },
        Super4?: { prototype: T4 },
        Super5?: T5,
        Super6?: T6,
        Super7?: T7,
        Super8?: T8,
        Super9?: T9,
        Super10?: T10,
        Super11?: T11,
        Super12?: T12,
        Super13?: T13,
        Super14?: T14,
        Super15?: T15,
        Super16?: T16
    ): Intersection<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16> {
        function Composition(): Object {
            return this
        }

        const Supers = [
            Super1,
            Super2,
            Super3,
            Super4,
            Super5,
            Super6,
            Super7,
            Super8,
            Super9,
            Super10,
            Super11,
            Super12,
            Super13,
            Super14,
            Super15,
            Super16,
        ].filter(v => v !== undefined)

        Object.assign(
            Composition.prototype,
            ...Supers.map(SuperClass => (SuperClass as { prototype }).prototype),
            {
                ['___supers']: Supers.map(() => {
                    return function (self, link, SuperClass, ...args) {
                        if (
                            SuperClass.prototype instanceof Effect ||
                            SuperClass.prototype instanceof Entity
                        ) {
                            if (SuperClass['___constructor']) {
                                SuperClass['___constructor'].call(self, link, ...args)
                            } else {
                                //@ts-ignore
                                const object = new SuperClass(link, ...args)
                                Object.assign(self, object)
                                Object.keys(object).forEach(k => {
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
            }
        )

        return Composition as never
    }
}
Object.assign(global, module)
