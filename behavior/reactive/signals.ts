// Reactive signals system - универсальная реактивность для любых модулей

export interface Signal<T> {
    (): T
    set(value: T): void
    update(fn: (prev: T) => T): void
    subscribe(listener: (value: T) => void): () => void
}

export interface Computed<T> {
    (): T
    subscribe(listener: (value: T) => void): () => void
}

// Current effect being executed
let currentEffect: (() => void) | null = null
const effectStack: (() => void)[] = []

// Signal implementation
export function signal<T>(initialValue: T): Signal<T> {
    let value = initialValue
    const subscribers = new Set<(value: T) => void>()

    const read = (): T => {
        // Track this signal in current effect
        if (currentEffect) {
            subscribers.add(currentEffect)
        }

        return value
    }

    const write = (newValue: T): void => {
        if (value !== newValue) {
            value = newValue
            // Notify all subscribers
            subscribers.forEach(fn => {
                fn(newValue)
            })
        }
    }

    const update = (fn: (prev: T) => T): void => {
        write(fn(value))
    }

    const subscribe = (listener: (value: T) => void): (() => void) => {
        subscribers.add(listener)
        return () => subscribers.delete(listener)
    }

    // Make function callable
    const signalFn = read as Signal<T>
    signalFn.set = write
    signalFn.update = update
    signalFn.subscribe = subscribe

    return signalFn
}

// Computed signal
export function computed<T>(fn: () => T): Computed<T> {
    let value: T
    let isStale = true
    const subscribers = new Set<(value: T) => void>()

    const compute = (): T => {
        if (isStale) {
            // Track dependencies
            effectStack.push(() => {
                isStale = true
                // Re-run computation
                const newValue = compute()

                if (newValue !== value) {
                    value = newValue
                    subscribers.forEach(fn => fn(newValue))
                }
            })
            currentEffect = effectStack[effectStack.length - 1]

            value = fn()
            isStale = false

            effectStack.pop()
            currentEffect = effectStack[effectStack.length - 1] || null
        }

        return value
    }

    const read = (): T => {
        // Track this computed in current effect
        if (currentEffect) {
            subscribers.add(currentEffect)
        }

        return compute()
    }

    const subscribe = (listener: (value: T) => void): (() => void) => {
        subscribers.add(listener)
        return () => subscribers.delete(listener)
    }

    const computedFn = read as Computed<T>
    computedFn.subscribe = subscribe

    return computedFn
}

// Effect that runs when dependencies change
export function effect(fn: () => void): () => void {
    const execute = () => {
        effectStack.push(execute)
        currentEffect = execute

        try {
            fn()
        } finally {
            effectStack.pop()
            currentEffect = effectStack[effectStack.length - 1] || null
        }
    }

    // Run immediately
    execute()

    // Return cleanup function
    return () => {
        // Remove from all subscribers when effect is disposed
        // This would need more sophisticated tracking in a real implementation
    }
}

// Helper to create reactive properties
export function reactive<T extends Record<string, unknown>>(obj: T): T {
    const signals: Record<string, Signal<unknown>> = {}
    const proxy = {} as T

    for (const [key, value] of Object.entries(obj)) {
        signals[key] = signal(value)

        Object.defineProperty(proxy, key, {
            get() {
                return signals[key]()
            },
            set(newValue) {
                signals[key].set(newValue)
            },
            enumerable: true,
            configurable: true,
        })
    }

    return proxy
}