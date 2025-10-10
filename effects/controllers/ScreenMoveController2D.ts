import Enability from '@sky-modules/effects/mixins/EnabledMixin'
import Vector2 from '@sky-modules/math/Vector2'

export interface ScreenMoveController2DParameters {
    camera: Vector2
}
export default interface ScreenMoveController2D extends Enability {}
@mixin(Enability)
export default class ScreenMoveController2D {
    readonly effect: Effect
    velocity: Vector2 = new Vector2()
    readonly camera: Vector2

    @hook static onGlobalMouseMove(this: ScreenMoveController2D, ev: Sky.MouseMoveEvent): void {
        const padding = 10
        const left = -window.innerWidth / 2 + padding + this.camera.x
        const right = window.innerWidth / 2 - padding + this.camera.x
        const top = -window.innerHeight / 2 + padding + this.camera.y
        const bottom = window.innerHeight / 2 - padding + this.camera.y

        if (ev.x < left) {
            this.velocity.x = -(left - ev.x) * 100
        } else if (ev.x > right) {
            this.velocity.x = (ev.x - right) * 100
        } else {
            this.velocity.x = 0
        }

        if (ev.y < top) {
            this.velocity.y = -(top - ev.y) * 100
        } else if (ev.y > bottom) {
            this.velocity.y = (ev.y - bottom) * 100
        } else {
            this.velocity.y = 0
        }
    }

    constructor(dep: EffectDep, parameters: ScreenMoveController2DParameters) {
        this.effect = new Effect(deps, this)
        Enability.super(this)

        this.camera = parameters.camera
    }

    protected update(ev: Sky.UpdateEvent): void {
        this.camera.add({ x: this.velocity.x * ev.dt, y: this.velocity.y * ev.dt })
    }
}
