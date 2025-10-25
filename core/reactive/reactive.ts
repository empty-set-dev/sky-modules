import { createRoot, createSignal, createEffect, createMemo } from 'solid-js'
import type { Signal, Accessor } from 'solid-js'

// Глобальный root для реактивности
let globalDispose: (() => void) | null = null

export function initGlobalRoot() {
    if (globalDispose) {
        globalDispose()
    }

    createRoot(dispose => {
        globalDispose = dispose
    })
}

initGlobalRoot()

// Хранилище для signals
const signalStore = new WeakMap<object, Map<string | symbol, Signal<any>>>()

// Декоратор для реактивных свойств
export function reactive(target: any, propertyKey: string | symbol) {
    const privateKey = Symbol(`__${String(propertyKey)}`)

    Object.defineProperty(target, propertyKey, {
        get(this: any) {
            if (!signalStore.has(this)) {
                signalStore.set(this, new Map())
            }

            const signals = signalStore.get(this)!

            if (!signals.has(propertyKey)) {
                const [getter, setter] = createSignal(this[privateKey])
                signals.set(propertyKey, [getter, setter])
            }

            const [getter] = signals.get(propertyKey)!
            return getter()
        },

        set(this: any, value: any) {
            if (!signalStore.has(this)) {
                signalStore.set(this, new Map())
            }

            const signals = signalStore.get(this)!

            if (!signals.has(propertyKey)) {
                const [getter, setter] = createSignal(value)
                signals.set(propertyKey, [getter, setter])
            } else {
                const [, setter] = signals.get(propertyKey)!
                setter(value)
            }

            this[privateKey] = value
        },

        enumerable: true,
        configurable: true,
    })
}

// Хранилище для computed значений с ленивой инициализацией
const computedStore = new WeakMap<object, Map<string | symbol, Accessor<any>>>()

// Декоратор для computed свойств с ЛЕНИВЫМ созданием memo
export function computed(
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.get

    if (!originalMethod) {
        throw new Error('@computed can only be used on getter methods')
    }

    descriptor.get = function (this: any) {
        if (!computedStore.has(this)) {
            computedStore.set(this, new Map())
        }

        const computeds = computedStore.get(this)!

        // Ленивое создание memo - только при первом обращении
        if (!computeds.has(propertyKey)) {
            console.log(`[Computed] Creating lazy memo for "${String(propertyKey)}"`)
            const memo = createMemo(() => originalMethod.call(this))
            computeds.set(propertyKey, memo)
        }

        return computeds.get(propertyKey)!()
    }

    return descriptor
}

// Декоратор для автоматических эффектов
export function effect(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (this: any, ...args: any[]) {
        createEffect(() => {
            originalMethod.call(this, ...args)
        })
    }

    return descriptor
}

// Упрощенный декоратор класса - БЕЗ предварительной инициализации
export function Reactive<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args)
            // Computed создаются лениво при первом обращении
        }
    }
}

// Дополнительная утилита для принудительной инициализации (если нужно)
export function initComputed(instance: any, propertyKey: string | symbol) {
    // Просто обращаемся к свойству
    void instance[propertyKey]
}

// Утилита для проверки, был ли computed инициализирован
export function isComputedInitialized(instance: any, propertyKey: string | symbol): boolean {
    const computeds = computedStore.get(instance)
    return computeds ? computeds.has(propertyKey) : false
}
