import assume from '../assume'
import Callback, { invokeCallback } from '../Callback'

/**
 * Hook function that can intercept and modify execution flow
 *
 * Hooks form a chain where each hook can:
 * - Inspect and modify arguments
 * - Execute before/after the next hook
 * - Skip or replace subsequent hooks
 */
export type Hook = ((
    this: unknown,
    next: (this: unknown, ...args: unknown[]) => void,
    ...args: unknown[]
) => void) & { next: Hook }

/**
 * Wildcard hook that receives the event name as first argument
 */
export type AnyHook = ((
    this: unknown,
    next: (this: unknown, ...args: unknown[]) => void,
    eventName: string,
    ...args: unknown[]
) => void) & { next: Hook }

/**
 * Object that owns and can execute hooks
 */
export type HooksOwner = Record<PropertyKey, (...args: unknown[]) => void> & {
    __hooks: Record<PropertyKey, Hook> & { onAny?: AnyHook }
    __bakedHooks: Record<
        PropertyKey,
        (eventName: string, callback: Callback<unknown[], unknown>, ...args: unknown[]) => unknown
    >
}

/**
 * Decorator to register a method as a hook
 *
 * Hooks allow intercepting method calls with middleware-like chains.
 * Multiple hooks can be added to the same method and will execute in order.
 *
 * @example
 * ```typescript
 * class Service {
 *   @hook
 *   onRequest(next, request) {
 *     console.log('Before:', request)
 *     next(request)
 *     console.log('After:', request)
 *   }
 *
 *   handleRequest(request) {
 *     return withHooks('onRequest', this, (req) => {
 *       return processRequest(req)
 *     }, request)
 *   }
 * }
 * ```
 *
 * @param prototype - Class prototype
 * @param k - Method name
 * @param descriptor - Property descriptor
 */
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

/**
 * Execute a callback with registered hooks
 *
 * Runs the callback through a chain of registered hooks, allowing each hook
 * to intercept, modify, or skip execution.
 *
 * @example
 * ```typescript
 * class Logger {
 *   @hook
 *   onLog(next, message) {
 *     const timestamp = new Date().toISOString()
 *     next(`[${timestamp}] ${message}`)
 *   }
 *
 *   log(message: string) {
 *     return withHooks('onLog', this, (msg) => {
 *       console.log(msg)
 *     }, message)
 *   }
 * }
 *
 * const logger = new Logger()
 * logger.log('Hello') // Logs: [2024-01-01T12:00:00.000Z] Hello
 * ```
 *
 * @template A - Callback argument types
 * @template R - Callback return type
 * @template H - Hooks owner type
 * @param eventType - Name of the hook event
 * @param hooksOwner - Object that owns the hooks
 * @param callback - Function to execute after hooks
 * @param args - Arguments to pass through hooks
 * @returns Result of the callback execution
 */
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
