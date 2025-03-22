import globalify from 'sky/utilities/globalify'

declare global {
    function action_hook(prototype: Object, k: Object.Index, descriptor: PropertyDescriptor): void
}

export default function action_hook(
    prototype: Object,
    k: Object.Index,
    descriptor: PropertyDescriptor
): void {
    const prototypeAsActionsHooks = prototype as never as {
        __hooks: Record<Object.Index, Function>
    }

    if (
        Object.getOwnPropertyDescriptor(prototype, '__hooks')?.value !==
        prototypeAsActionsHooks.__hooks
    ) {
        const parentActionsHooks = prototypeAsActionsHooks.__hooks
        prototypeAsActionsHooks.__hooks = {}
        Object.setPrototypeOf(prototypeAsActionsHooks.__hooks, parentActionsHooks)
    }

    prototypeAsActionsHooks.__hooks ??= {}

    if (prototypeAsActionsHooks.__hooks[k]) {
        const originalActionHook = prototypeAsActionsHooks.__hooks[k]
        const actionHook = descriptor.value
        prototypeAsActionsHooks.__hooks[k] = function (...args: unknown[]): void {
            originalActionHook.call(this, ...args)
            actionHook.call(this, ...args)
        }
    } else {
        prototypeAsActionsHooks.__hooks[k] = descriptor.value
    }

    descriptor.value = null
}

globalify({
    action_hook,
})
