import globalify from 'sky/utilities/globalify'

declare global {
    function hook(prototype: Object, k: Object.Index, descriptor: PropertyDescriptor): void
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
        prototypeWithHooks.__hooks[k] = function (...args: unknown[]): void {
            originalHook.call(this, ...args.slice(0, -1), () => hook.call(this, ...args))
        }
    } else {
        prototypeWithHooks.__hooks[k] = descriptor.value
    }
}

globalify({
    hook,
})
