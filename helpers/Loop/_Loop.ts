export default class Loop {
    readonly effect: Effect
    async?: AsyncSlot

    constructor(interval: Time, callback: (dt: Time) => void, deps: EffectDeps) {
        this.effect = new Effect(deps, this)

        const controller = { disposed: false }
        this.async = loop(controller, interval, callback)

        this.effect.destroy = async (): Promise<void> => {
            controller.disposed = true

            await this.async
        }
    }
}

async function loop(
    controller: { disposed: boolean },
    interval: Time,
    callback: (dt: Time) => void
): Promise<void> {
    const timer = new Timer('loop')

    while (true) {
        if (controller.disposed) {
            return
        }

        const dt = timer.deltaTime()
        await callback(dt)
        await timer.wait(interval)
    }
}
