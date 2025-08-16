import globalify from 'sky/utilities/globalify'

declare global {
    function hook(prototype: Object, k: Object.Index, descriptor: PropertyDescriptor): void
    function emitWithHooks<T>(
        eventName: string,
        event: T,
        hooks: object,
        emitEvent: () => void
    ): void
}

function hook(prototype: object, k: Object.Index, descriptor: PropertyDescriptor): void {
    const prototypeWithHooks = prototype as {
        __hooks: Record<Object.Index, Function>
    }

    if (
        Object.getOwnPropertyDescriptor(prototype, '__hooks')?.value !== prototypeWithHooks.__hooks
    ) {
        const parentHooks = prototypeWithHooks.__hooks
        prototypeWithHooks.__hooks = {}
        Object.setPrototypeOf(prototypeWithHooks.__hooks, parentHooks)
    }

    prototypeWithHooks.__hooks ??= {}

    if (prototypeWithHooks.__hooks[k]) {
        const originalHook = prototypeWithHooks.__hooks[k]
        const hook = descriptor.value
        prototypeWithHooks.__hooks[k] = function (
            eventName: string,
            event: unknown,
            next: Function
        ): void {
            originalHook.call(this, eventName, event, () => hook.call(this, eventName, event, next))
        }
    } else {
        prototypeWithHooks.__hooks[k] = descriptor.value
    }
}

function emitWithHooks<T>(
    eventName: string,
    event: T,
    recipient: object,
    emitEvent: () => void
): void {
    const recipient_ = recipient as unknown as { __hooks: Record<Object.Index, Function> }

    const emitEventWithHooks = (): void => {
        if (recipient_.__hooks && recipient_.__hooks[eventName]) {
            recipient_.__hooks[eventName].call(recipient_, event, emitEvent)

            return
        }

        emitEvent()
    }

    if (recipient_.__hooks && recipient_.__hooks.onAny) {
        recipient_.__hooks.onAny.call(recipient_, eventName, event, emitEventWithHooks)

        return
    }

    emitEventWithHooks()
}

globalify({
    hook,
    emitWithHooks,
})
