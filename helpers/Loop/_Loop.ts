export default class Loop {
    readonly effect: Effect

    constructor(interval: Time, callback: (dt: Time) => void, deps: EffectDeps) {
        this.effect = new Effect(deps)

        const controller = { disposed: false }
        __setRun(controller, new Timer('loop'), interval, callback)

        this.effect.destroy = (): void => {
            controller.disposed = true
        }
    }
}

async function __setRun(
    controller: { disposed: boolean },
    timer: Timer,
    interval: Time,
    callback: (dt: Time) => void
): Promise<void> {
    if (controller.disposed) {
        return
    }

    const dt = timer.time()
    await callback(dt)
    await idle(Time(interval.valueOf() - dt.valueOf(), seconds))

    __setRun(controller, timer, interval, callback)
}
