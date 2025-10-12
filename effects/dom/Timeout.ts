export default class Timeout {
    readonly effect: Effect

    constructor(
        dep: EffectDep,
        callback: (...args: unknown[]) => void,
        timeout: Time,
        ...args: unknown[]
    ) {
        this.effect = new Effect(dep, this)

        const identifier = setTimeout(callback, timeout.inMilliseconds, ...args)

        this.effect.dispose = (): void => {
            clearTimeout(identifier)
        }
    }
}
