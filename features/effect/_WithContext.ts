import globalify from 'sky/utilities/globalify'

declare global {
    class WithContext<T extends { constructor: Function }> {
        constructor(target: EffectsRoot, context: T, deps: EffectDeps)
    }
}

class WithContext<T extends { constructor: Function }> {
    readonly effect: Effect

    constructor(target: EffectsRoot, context: T, deps: EffectDeps) {
        this.effect = new Effect(deps)

        target.addContext(context)

        this.effect.destroy = (): void => {
            target.removeContext(context)
        }
    }
}

globalify({ WithContext })
