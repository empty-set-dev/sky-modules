import globalify from 'sky/core/globalify'

declare global {
    function hook(prototype: Object, k: PropertyKey, descriptor: PropertyDescriptor): void
    function emitWithHooks<T, H>(
        //TODO onAny on Entity and on Effect!
        eventName: string,
        hooksOwner: H,
        recipient: T,
        emitEvent: (this: T, eventName: string, ...args: unknown[]) => void,
        ...args: unknown[]
    ): void
}

type Hook = ((
    this: unknown,
    next: (this: unknown, ...args: unknown[]) => void,
    ...args: unknown[]
) => void) & { next: Hook }
type AnyHook = ((
    this: unknown,
    next: (this: unknown, ...args: unknown[]) => void,
    eventName: string,
    ...args: unknown[]
) => void) & { next: Hook }
type HooksOwner = Record<PropertyKey, (...args: unknown[]) => void> & {
    __hooks: Record<PropertyKey, Hook> & { onAny?: AnyHook }
    __bakedHooks: Record<PropertyKey, (eventName: string, ...args: unknown[]) => void>
}

function hook(prototype: object, k: PropertyKey, descriptor: PropertyDescriptor): void {
    as<HooksOwner>(prototype)

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
        let hook = prototype.__hooks[k]

        while (hook.next) {
            hook = hook.next
        }

        hook.next = descriptor.value
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
    as<HooksOwner>(hooksOwner)

    if (hooksOwner.__hooks) {
        if (hooksOwner.__bakedHooks[eventName] == null) {
            let hook = hooksOwner.__hooks[eventName]
            let onAny = hooksOwner.__hooks.onAny

            let current = emitEvent

            while (hook != null) {
                const original = current
                function next(this: unknown, ...args: unknown[]): void {
                    original.call(this as T, eventName, ...(args as A))
                }
                const hook_ = hook
                current = function (this: T, eventName: string, ...args: A): void {
                    hook_.call(this, next, ...args)
                }
                hook = hook.next
            }

            while (onAny != null) {
                const original = current
                function next(this: unknown, ...args: unknown[]): void {
                    original.call(this as T, eventName, ...(args as A))
                }
                const onAny_ = onAny
                current = function (this: T, eventName: string, ...args: A): void {
                    onAny_.call(this, next, eventName, ...args)
                }
                onAny = onAny.next
            }

            hooksOwner.__bakedHooks[eventName] = current as (
                this: unknown,
                eventName: string,
                ...args: unknown[]
            ) => void
        }

        hooksOwner.__bakedHooks[eventName].call(recipient, eventName, ...args)
    } else {
        emitEvent.call(recipient, eventName, ...args)
    }
}

globalify({
    hook,
    emitWithHooks,
})
