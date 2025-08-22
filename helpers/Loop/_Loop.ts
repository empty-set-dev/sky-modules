export default class Loop {
    readonly effect: Effect
    looping?: Async

    constructor(interval: Time, callback: (dt: Time) => void, deps: EffectDeps) {
        this.effect = new Effect(deps, this)

        const controller = { disposed: false }
        this.looping = this.__loop(controller, interval, callback)

        this.effect.destroy = async (): Promise<void> => {
            controller.disposed = true
            await this.looping
        }
    }

    async __loop(
        controller: { disposed: boolean },
        interval: Time,
        callback: (dt: Time) => void
    ): Promise<void> {
        const timer = new Timer()
        const waitTimer = new WaitTimer('loop')

        while (true) {
            if (controller.disposed) {
                return
            }

            await callback(timer.deltaTime())
            await waitTimer.wait(interval)
        }
    }
}
