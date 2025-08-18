import globalify from 'sky/utilities/globalify'

declare global {
    function hook(prototype: Object, k: Object.Index, descriptor: PropertyDescriptor): void
    function emitWithHooks<T, H>(
        eventName: string,
        hooksOwner: H,
        recipient: T,
        emitEvent: (this: T, eventName: string, ...args: unknown[]) => void,
        ...args: unknown[]
    ): void
}

type Hook = (
    this: unknown,
    next: (this: unknown, ...args: unknown[]) => void,
    ...args: unknown[]
) => void
type AnyHook = (
    this: unknown,
    next: (this: unknown, ...args: unknown[]) => void,
    eventName: string,
    ...args: unknown[]
) => void
type HooksOwner = Record<Object.Index, (...args: unknown[]) => void> & {
    __hooks: Record<Object.Index, Hook> & { onAny?: AnyHook }
    __bakedHooks: Record<Object.Index, (...args: unknown[]) => void>
}

function hook(prototype: object, k: Object.Index, descriptor: PropertyDescriptor): void {
    if (!is<HooksOwner>(prototype)) {
        return null!
    }

    if (Object.getOwnPropertyDescriptor(prototype, '__hooks')?.value !== prototype.__hooks) {
        const parentHooks = prototype.__hooks
        prototype.__hooks = {}
        Object.setPrototypeOf(prototype.__hooks, parentHooks)
    }

    prototype.__hooks ??= {}

    if (
        Object.getOwnPropertyDescriptor(prototype, '__bakedHooks')?.value !== prototype.__bakedHooks
    ) {
        prototype.__bakedHooks = {}
    }

    prototype.__bakedHooks ??= {}

    if (prototype.__hooks[k]) {
        const originalHook = prototype.__hooks[k]
        const hook = descriptor.value
        prototype.__hooks[k] = function (
            next: (...args: unknown[]) => void,
            ...args: unknown[]
        ): void {
            originalHook.call(this, hook, next, ...args)
        }
    } else {
        prototype.__hooks[k] = descriptor.value
    }
}

function emitWithHooks<T, H, A extends unknown[]>(
    eventName: string,
    hooksOwner: H,
    recipient: T,
    emitEvent: (this: T, eventName: string, ...args: A) => void,
    ...args: A
): void {
    if (!is<HooksOwner>(hooksOwner)) {
        return null!
    }

    if (hooksOwner.__hooks) {
        if (hooksOwner.__bakedHooks[eventName] == null) {
            const hook = hooksOwner.__hooks[eventName]

            if (hooksOwner.__hooks && hooksOwner.__hooks.onAny) {
                const anyHook = hooksOwner.__hooks.onAny
                function next(this: unknown, ...args: unknown[]): void {
                    emitEvent.call(this as T, eventName, ...(args as A))
                }
                function next2(this: unknown, ...args: unknown[]): void {
                    hook.call(this, next, ...args)
                }
                hooksOwner.__bakedHooks[eventName] = function (this: T, ...args: unknown[]): void {
                    anyHook.call(this, next2, eventName, ...args)
                }
            } else {
                function next(this: unknown, ...args: unknown[]): void {
                    emitEvent.call(this as T, eventName, ...(args as A))
                }
                hooksOwner.__bakedHooks[eventName] = function (this: T, ...args: unknown[]): void {
                    hook.call(this, next, ...args)
                }
            }
        }

        hooksOwner.__bakedHooks[eventName](...args)
    } else {
        emitEvent.call(recipient, eventName, ...args)
    }
}

globalify({
    hook,
    emitWithHooks,
})
