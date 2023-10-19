const loop = effect(
    (resolve, interval: time, minInterval: time, callback: (dt: time) => void): (() => void) => {
        const controller = { dispose: false }
        setRun(controller, new Timer('loop'), interval, minInterval, callback)
        return (): void => {
            controller.dispose = true
            resolve()
        }
    }
)

export default loop

const setRun = async (
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

    setRun(controller, timer, interval, minInterval, callback)
}
