import globalify from 'sky/utilities/globalify'

declare global {
    class WithContext<T extends { constructor: Function }> extends Effect {
        constructor(target: EffectsRoot, context: T, deps: EffectDeps)
    }
}

class WithContext<T extends { constructor: Function }> extends Effect {
    constructor(target: EffectsRoot, context: T, deps: EffectDeps) {
        super(deps)

        target.addContext(context)

        this.destroy = (): void => {
            target.removeContext(context)
        }
    }
}

globalify({ WithContext })
