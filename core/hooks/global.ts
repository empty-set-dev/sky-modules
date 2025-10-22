import Callback from '../Callback'
import globalify from '../globalify'

declare global {
    function hook(prototype: Object, k: PropertyKey, descriptor: PropertyDescriptor): void
    function withHooks<A extends unknown[], R, H>(
        eventType: string,
        hooksOwner: H,
        callback: Callback<A, R>,
        ...args: A
    ): R
}

globalify({
    hook,
    withHooks,
})
