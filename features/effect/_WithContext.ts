import globalify from 'sky/helpers/globalify'

import Root from './_Root'

declare global {
    class WithContext<T> extends Effect {
        constructor(target: Root, context: T, deps: EffectDeps)
    }
}

@effect
class WithContext<T> extends Effect {
    constructor(target: Root, context: T, deps: EffectDeps) {
        super(deps)
    }
}

function withContext<T extends { constructor: Function }>(
    target: Root,
    context: T,
    deps: EffectDeps
): Effect {
    return new Effect(() => {
        target.addContext(context)

        return () => {
            target.removeContext(context)
        }
    }, deps)
}

globalify({ withContext })
