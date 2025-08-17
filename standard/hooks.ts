import globalify from 'sky/utilities/globalify'

declare global {
    type Hook = (event: Sky.Event, next: () => void) => void
    type AnyHook = (eventName: string, event: Sky.Event, next: () => void) => void
    function hook(prototype: Object, k: Object.Index, descriptor: PropertyDescriptor): void
    function emitWithHooks<T>(
        eventName: string,
        event: T,
        hooks: object,
        emitEvent: () => void
    ): void
}

type HooksOwner = { __hooks: Record<Object.Index, Hook | AnyHook> }

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

    if (prototype.__hooks[k]) {
        if (k === 'onAny') {
            const originalHook = prototype.__hooks[k]
            const hook = descriptor.value
            prototype.__hooks[k] = function (
                eventName: string,
                event: Sky.Event,
                next: () => void
            ): void {
                ;(originalHook as AnyHook).call(this, eventName, event, () =>
                    hook.call(this, eventName, event, next)
                )
            }
        } else {
            const originalHook = prototype.__hooks[k]
            const hook = descriptor.value
            prototype.__hooks[k] = function (event: Sky.Event, next: () => void): void {
                ;(originalHook as Hook).call(this, event, () => hook.call(this, event, next))
            }
        }
    } else {
        prototype.__hooks[k] = descriptor.value
    }
}

function emitWithHooks(
    eventName: string,
    event: Sky.Event,
    recipient: object,
    emitEvent: () => void
): void {
    if (!is<HooksOwner>(recipient)) {
        return null!
    }

    const emitEventWithHooks = (): void => {
        if (recipient.__hooks && recipient.__hooks[eventName]) {
            ;(recipient.__hooks[eventName] as Hook).call(recipient, event, emitEvent)

            return
        }

        emitEvent()
    }

    if (recipient.__hooks && recipient.__hooks.onAny) {
        ;(recipient.__hooks.onAny as AnyHook).call(recipient, eventName, event, emitEventWithHooks)

        return
    }

    emitEventWithHooks()
}

globalify({
    hook,
    emitWithHooks,
})
