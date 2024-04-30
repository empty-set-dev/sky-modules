export default class Loop extends Effect {
    constructor(interval: time, minInterval: time, callback: (dt: time) => void, deps: EffectDeps) {
        super(deps)

        const controller = { dispose: false }
        __setRun(controller, new Timer('loop'), interval, minInterval, callback)
        this.destroy = (): void => {
            controller.dispose = true
        }
    }
}

async function __setRun(
    controller: { dispose: boolean },
    timer: Timer,
    interval: time,
    minInterval: time,
    callback: (dt: time) => void
): Promise<void> => {
    if (controller.dispose) {
        return
    }

    const dt = timer.time()
    await callback(dt)
    await idle(Math.max(interval.valueOf() - dt.valueOf(), minInterval.valueOf()))

    __setRun(controller, timer, interval, minInterval, callback)
}
