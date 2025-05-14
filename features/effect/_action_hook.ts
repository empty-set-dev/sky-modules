import globalify from 'sky/utilities/globalify'

declare global {
    function action_hooks(constructor: Object): void
    function action_hook(prototype: Object, k: Object.Index, descriptor: PropertyDescriptor): void
}

// let hooks: [Function, unknown] = []

function action_hooks(): void {
    // console.log(constructor, hooks)
}

function action_hook(prototype: Object, k: Object.Index, descriptor: PropertyDescriptor): void {
    if (!descriptor) {
        // hooks.push([prototype, k])
        return
    }

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
            originalActionHook.call(this, ...args.slice(0, -1), () =>
                actionHook.call(this, ...args)
            )
        }
    } else {
        prototypeAsActionsHooks.__hooks[k] = descriptor.value
    }

    descriptor.value = null
}

globalify({
    action_hooks,
    action_hook,
})
