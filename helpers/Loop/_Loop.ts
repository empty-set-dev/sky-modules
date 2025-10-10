import Effect from '../../features/effect/Effect'
import EffectDep from '../../features/effect/EffectDep'
import Time from '../../utilities/Time'
import Async from '../../core/async/async'

declare global {
    namespace Promise {
        type Void = Promise<void>
    }
}

export default class Loop {
    readonly effect: Effect
    looping?: Async

    constructor(interval: Time, callback: (dt: Time) => void, deps: EffectDep) {
        this.effect = new Effect(deps, this)

        const controller = { disposed: false }
        this.looping = this.__loop(controller, interval, callback)

        this.effect.destroy = async (): Promise.Void => {
            controller.disposed = true
            await this.looping
        }
    }

    private async __loop(
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
