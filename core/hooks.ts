import globalify from '@sky-modules/core/globalify'

import { invokeCallback } from './Callback'

declare global {
    function hook(prototype: Object, k: PropertyKey, descriptor: PropertyDescriptor): void
    function withHooks<A extends unknown[], R, H>(
        eventType: string,
        hooksOwner: H,
        callback: Callback<A, R>,
        ...args: A
    ): R
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
    __bakedHooks: Record<
        PropertyKey,
        (eventName: string, callback: Callback, ...args: unknown[]) => unknown
    >
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

function withHooks<A extends unknown[], R, H>(
    eventType: string,
    hooksOwner: H,
    callback: Callback<A, R>,
    ...args: A
): R {
    as<HooksOwner>(hooksOwner)
    bakeHooks(eventType, hooksOwner)

    return hooksOwner.__bakedHooks[eventType].call(hooksOwner, eventType, callback, ...args) as R
}

function bakeHooks<H extends HooksOwner>(eventType: string, hooksOwner: H): void {
    if (hooksOwner.__bakedHooks?.[eventType] != null) {
        return
    }

    const hooks: Hook[] = []
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
        callback: Callback<unknown[]>,
        ...args: unknown[]
    ): void {
        let index = 0

        function next(this: unknown, ...args: unknown[]): void {
            if (index < hooks.length) {
                const currentHook = hooks[index++]
                currentHook.call(this, next, ...args)
            } else {
                return invokeCallback(callback, ...args)
            }
        }

        return next.call(this, ...args)
    }

    hooksOwner.__bakedHooks ??= {}
    hooksOwner.__bakedHooks[eventType] = compiledFunction
}

globalify({
    hook,
    withHooks,
})
