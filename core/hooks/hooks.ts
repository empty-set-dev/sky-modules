import assume from '../assume'
import Callback, { invokeCallback } from '../Callback'

export type Hook = ((
    this: unknown,
    next: (this: unknown, ...args: unknown[]) => void,
    ...args: unknown[]
) => void) & { next: Hook }

export type AnyHook = ((
    this: unknown,
    next: (this: unknown, ...args: unknown[]) => void,
    eventName: string,
    ...args: unknown[]
) => void) & { next: Hook }

export type HooksOwner = Record<PropertyKey, (...args: unknown[]) => void> & {
    __hooks: Record<PropertyKey, Hook> & { onAny?: AnyHook }
    __bakedHooks: Record<
        PropertyKey,
        (eventName: string, callback: Callback<unknown[], unknown>, ...args: unknown[]) => unknown
    >
}

export function hook(prototype: object, k: PropertyKey, descriptor: PropertyDescriptor): void {
    assume<HooksOwner>(prototype)

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

export function withHooks<A extends unknown[], R, H>(
    eventType: string,
    hooksOwner: H,
    callback: Callback<A, R>,
    ...args: A
): R {
    assume<HooksOwner>(hooksOwner)
    bakeHooks(eventType, hooksOwner)

    return hooksOwner.__bakedHooks[eventType].call(
        hooksOwner,
        eventType,
        callback as Callback<unknown[], unknown>,
        ...args
    ) as R
}

function bakeHooks<H extends HooksOwner>(eventType: string, hooksOwner: H): void {
    if (hooksOwner.__bakedHooks?.[eventType] != null) {
        return
    }

    const hooks: Hook[] = []
    hooksOwner.__hooks ??= {}
    let hook = hooksOwner.__hooks[eventType]

    while (hook != null) {
        hooks.push(hook)
        hook = hook.next
    }

    let onAny = hooksOwner.__hooks.onAny

    while (onAny != null) {
        const currentOnAny = onAny
        hooks.push(function (
            this: unknown,
            next: (this: unknown, ...args: unknown[]) => void,
            ...args: unknown[]
        ) {
            currentOnAny.call(this, next, eventType, ...args)
        } as Hook)
        onAny = onAny.next
    }

    const compiledFunction = function (
        this: unknown,
        _eventName: string,
        callback: Callback<unknown[], unknown>,
        ...args: unknown[]
    ): void {
        let index = 0

        function next(this: unknown, ...args: unknown[]): void {
            if (index < hooks.length) {
                const currentHook = hooks[index++]
                currentHook.call(this, next, ...args)
            } else {
                invokeCallback(callback, ...args)
            }
        }

        return next.call(this, ...args)
    }

    hooksOwner.__bakedHooks ??= {}
    hooksOwner.__bakedHooks[eventType] = compiledFunction
}
