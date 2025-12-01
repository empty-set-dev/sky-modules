import Effect from '../../features/effect/Effect'
import EffectDep from '../../features/effect/EffectDep'
import Time from '../../utilities/Time'
import Async from '../../core/async/async'

declare global {
    namespace Promise {
        type Void = Promise<void>
    }
}

/**
 * Asynchronous loop manager with automatic cleanup through the effect system.
 *
 * Loop provides a way to run repeating asynchronous operations at specified intervals,
 * with automatic lifecycle management via effects. The loop stops and cleans up when
 * its parent effect is disposed.
 *
 * @example Basic interval loop
 * ```typescript
 * import Loop from '@sky-modules/helpers/Loop'
 * import { Effect, EffectTree } from '@sky-modules/features/effect'
 *
 * const root = new EffectTree()
 * const effect = new Effect(root)
 *
 * // Run every 100ms
 * new Loop((100).milliseconds, (dt) => {
 *   console.log(`Loop tick, delta: ${dt.inMilliseconds}ms`)
 * }, effect)
 *
 * // Loop automatically stops when effect is disposed
 * effect.dispose()
 * ```
 *
 * @example Game update loop
 * ```typescript
 * class GameController {
 *   readonly effect: Effect
 *
 *   constructor(dep: EffectDep) {
 *     this.effect = new Effect(dep, this)
 *
 *     // Update game state 60 times per second
 *     new Loop((1/60).seconds, (dt) => {
 *       this.updatePhysics(dt)
 *       this.updateEntities(dt)
 *     }, this.effect)
 *   }
 * }
 * ```
 *
 * @example Server-side polling loop
 * ```typescript
 * new Loop((5).seconds, async (dt) => {
 *   const data = await fetchServerStatus()
 *   console.log('Server status:', data)
 * }, parentEffect)
 * ```
 */
export default class Loop {
    /** Effect managing the loop lifecycle */
    readonly effect: Effect
    /** Promise representing the running loop, resolved when stopped */
    looping?: Async

    /**
     * Creates a new asynchronous loop.
     *
     * @param interval Time interval between loop iterations
     * @param callback Function called on each iteration with delta time
     * @param dep Effect dependency - loop stops when parent effect is disposed
     */
    constructor(interval: Time, callback: (dt: Time) => void, dep: EffectDep) {
        this.effect = new Effect(dep, this)

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
