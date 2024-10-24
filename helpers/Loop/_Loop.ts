export default class Loop extends Effect {
    constructor(interval: Time, callback: (dt: Time) => void, deps: EffectDeps) {
        super(deps)

        const controller = { dispose: false }
        __setRun(controller, new Timer('loop'), interval, callback)

        this.destroy = (): void => {
            controller.dispose = true
        }
    }
}

async function __setRun(
    controller: { dispose: boolean },
    timer: Timer,
    interval: Time,
    callback: (dt: Time) => void
): Promise<void> {
    if (controller.dispose) {
        return
    }

    const dt = timer.time()
    await callback(dt)
    await idle(Time(interval.valueOf() - dt.valueOf(), seconds))

    __setRun(controller, timer, interval, callback)
}
