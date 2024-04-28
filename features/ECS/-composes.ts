import globalify from 'helpers/globalify'

declare global {
    function composes<
        T1,
        T2 = never,
        T3 = never,
        T4 = never,
        T5 = never,
        T6 = never,
        T7 = never,
        T8 = never,
        T9 = never,
        T10 = never,
        T11 = never,
        T12 = never,
        T13 = never,
        T14 = never,
        T15 = never,
        T16 = never
    >(
        Super1: { prototype: T1 },
        Super2?: { prototype: T2 },
        Super3?: { prototype: T3 },
        Super4?: { prototype: T4 },
        Super5?: { prototype: T5 },
        Super6?: { prototype: T6 },
        Super7?: { prototype: T7 },
        Super8?: { prototype: T8 },
        Super9?: { prototype: T9 },
        Super10?: { prototype: T10 },
        Super11?: { prototype: T11 },
        Super12?: { prototype: T12 },
        Super13?: { prototype: T13 },
        Super14?: { prototype: T14 },
        Super15?: { prototype: T15 },
        Super16?: { prototype: T16 }
    ): {
        prototype: Intersection<
            T1,
            T2,
            T3,
            T4,
            T5,
            T6,
            T7,
            T8,
            T9,
            T10,
            T11,
            T12,
            T13,
            T14,
            T15,
            T16
        >
    }
}

function composes<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10, T11, T12, T13, T14, T15, T16>(
    Super1: { prototype: T1 },
    Super2?: { prototype: T2 },
    Super3?: { prototype: T3 },
    Super4?: { prototype: T4 },
    Super5?: { prototype: T5 },
    Super6?: { prototype: T6 },
    Super7?: { prototype: T7 },
    Super8?: { prototype: T8 },
    Super9?: { prototype: T9 },
    Super10?: { prototype: T10 },
    Super11?: { prototype: T11 },
    Super12?: { prototype: T12 },
    Super13?: { prototype: T13 },
    Super14?: { prototype: T14 },
    Super15?: { prototype: T15 },
    Super16?: { prototype: T16 }
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

globalify({ composes })
