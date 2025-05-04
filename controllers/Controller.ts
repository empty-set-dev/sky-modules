export default class Controller {
    readonly effect: Effect

    constructor(deps: EffectDeps) {
        this.effect = new Effect(deps, this)
    }
}
