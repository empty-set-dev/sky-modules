import globalify from 'helpers/globalify'
import Timer from 'helpers/Timer/-Timer'

declare global {
    interface Link {
        emit(event: string, dt: time): void
    }
    function onEvery(time: time, callback: (dt: time) => void, deps: EffectDeps): Effect
    function emittingEvery(
        root: Root,
        time: time,
        dt: number,
        options: { log?: boolean; auto?: boolean }
    ): void
}

globalify({
    emittingEvery(
        parent: Parent,
        interval: time,
        minInterval: time,
        options: { auto?: boolean; log?: boolean } = {}
    ): void {
        const auto = options.auto ?? true
        const log = options.log ?? false

        const label = `Update(${interval.seconds.toFixed(2)} s, min ${minInterval.seconds.toFixed(
            2
        )} s)`
        const timer = new Timer(label)
        auto &&
            loop(interval, minInterval, async (): Promise<void> => {
                log && timer.log()
                parent.emit(label, timer.time())
            })
    },

    onEvery: (
        root: Root,
        interval: time,
        minInterval: time,
        callback: (dt: time) => void,
        deps: EffectDeps
    ): Effect =>
        root.on(
            `Update(${interval.seconds.toFixed(2)} s, min ${minInterval.seconds.toFixed(2)} s)`,
            callback,
            deps
        ),
})
