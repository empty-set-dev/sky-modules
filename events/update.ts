import Timer from 'utilities/Timer'

declare global {
    interface Effects {
        emit(event: string, dt: time): void
    }
    var Every: (entity: Entity | Effect, time: time, callback: (dt: time) => void) => void
    var emittingEvery: (
        entities: Entities,
        time: time,
        dt: number,
        options: { log?: boolean; auto?: boolean }
    ) => void
}

namespace module {
    export const emittingEvery = (
        link: Effects,
        interval: time,
        minInterval: time,
        options: { auto?: boolean; log?: boolean } = {}
    ): void => {
        const auto = options.auto ?? true
        const log = options.log ?? false

        const label = `Update(${interval.seconds.toFixed(2)} s, min ${minInterval.seconds.toFixed(
            2
        )} s)`
        const timer = new Timer(label)
        auto &&
            loop(interval, minInterval, async (): Promise<void> => {
                log && timer.log()
                link.emit(label, timer.time())
            })
    }
}

Object.assign(global, module, {
    Every: (
        entity: Entity | Effect,
        interval: time,
        minInterval: time,
        callback: (dt: time) => void
    ): void =>
        on(
            entity,
            `Update(${interval.seconds.toFixed(2)} s, min ${minInterval.seconds.toFixed(2)} s)`,
            callback
        ),
})
