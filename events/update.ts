import globalify from 'helpers/globalify'
import Timer from 'helpers/Timer'

declare global {
    interface Root {
        emit(event: string, dt: time): void
    }
    function emittingEvery(
        root: Root,
        interval: time,
        minInterval: time,
        deps: EffectDeps,
        options?: { log?: boolean }
    ): Effect
    function onEvery(time: time, callback: (dt: time) => void, deps: EffectDeps): Effect
}

globalify({
    emittingEvery(
        root: Root,
        interval: time,
        minInterval: time,
        deps: EffectDeps,
        options: { log?: boolean } = {}
    ): Effect {
        const log = options.log ?? false

        const label = `Update(${interval.seconds.toFixed(2)} s, min ${minInterval.seconds.toFixed(
            2
        )} s)`
        const timer = new Timer(label)
        return new Loop(
            interval,
            minInterval,
            async (): Promise<void> => {
                log && timer.log()
                root.emit(label, timer.time())
            },
            deps
        )
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
