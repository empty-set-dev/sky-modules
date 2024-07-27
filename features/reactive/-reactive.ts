import globalify from 'sky/helpers/globalify'

declare global {
    type ReactiveDeps = () => void

    function reactive(target: unknown, propertyKey: string): void
    function reactive<T>(depsFn: ReactiveDeps, fn: () => T): T
}

namespace lib {
    export function reactive(target: unknown, propertyKey: string): void
    export function reactive<T>(depsFn: ReactiveDeps, fn: () => T): T
    export function reactive(...args: unknown[]): unknown {
        if (typeof args[0] === 'function') {
            return args
        }

        const target = args[0] as unknown
        const propertyKey = args[1] as PropertyKey
        const valueSymbol = Symbol(propertyKey.toString())
        const valueIsActualSymbol = Symbol(`${propertyKey.toString()}IsActual`)
        const valueGetterSymbol = Symbol(`${propertyKey.toString()}Getter`)
        const dependsSymbol = Symbol(`${propertyKey.toString()}Depends`)
        const triggersSymbol = Symbol(`${propertyKey.toString()}Triggers`)

        Object.defineProperty(target, propertyKey, {
            get() {
                if (deps) {
                    deps.push([this, dependsSymbol])
                    return
                }

                if (this[valueIsActualSymbol]) {
                    return this[valueSymbol]
                }

                if (this[triggersSymbol] == null) {
                    this[valueSymbol] = this[valueGetterSymbol]()
                } else {
                    this[valueIsActualSymbol] = true
                    this[valueSymbol] = this[valueGetterSymbol]()
                }

                return this[valueSymbol]
            },

            set(value: unknown) {
                if (this[dependsSymbol]) {
                    this[dependsSymbol].forEach(depend => {
                        depend[0][depend[1]] = false
                    })
                }

                if (this[triggersSymbol]) {
                    this[triggersSymbol].forEach(trigger => {
                        trigger[0][trigger[1]].remove(trigger[2])
                    })
                }

                if (Array.isArray(value)) {
                    deps = []
                    value[0]()
                    const triggers = []
                    deps.forEach(dep => {
                        dep[0][dep[1]] ??= []
                        const trigger = [this, valueIsActualSymbol]
                        dep[0][dep[1]].push(trigger)
                        triggers.push([dep[0], dep[1], trigger])
                    })
                    deps = null
                    this[triggersSymbol] = triggers
                    this[valueGetterSymbol] = value[1]

                    return
                }

                if (typeof value === 'function') {
                    this[valueGetterSymbol] = value
                    this[valueIsActualSymbol] = false
                    this[triggersSymbol] = null

                    return
                }

                this[valueSymbol] = value
                this[valueIsActualSymbol] = true
                this[triggersSymbol] = null
            },
        })
    }

    let deps = null
}

globalify(lib)
