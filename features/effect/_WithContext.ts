import globalify from 'sky/helpers/globalify'

declare global {
    class WithContext extends Effect {
        constructor(target: Root, context: Root, deps: EffectDeps)
    }
}

@effect
class WithContext extends Effect {
    constructor(target: Root, context: Root, deps: EffectDeps) {
        super(deps)

        target.addContext(context)

        this.destroy = (): void => {
            target.removeContext(context)
        }
    }
}

globalify({ WithContext })
