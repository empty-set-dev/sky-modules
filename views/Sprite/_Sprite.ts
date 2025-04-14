import { Object3D } from 'three'

export default class Sprite extends Object3D {
    readonly effect: Effect

    constructor(deps: EffectDeps) {
        super()

        this.effect = new Effect(deps, {
            main: this,
        })
    }

    @action_hook
    onGlobalMouseDown(ev: MouseDownEvent): void {
        this['__transformPointEvent'](ev)
    }

    @action_hook
    onGlobalMouseUp(ev: MouseUpEvent): void {
        this['__transformPointEvent'](ev)
    }

    @action_hook
    onGlobalMouseMove(ev: MouseMoveEvent): void {
        this['__transformPointEvent'](ev)
    }

    @action_hook
    globalTouchBegin(ev: TouchBeginEvent): void {
        this['__transformPointEvent'](ev)
    }

    @action_hook
    globalTouchEnd(ev: TouchEndEvent): void {
        this['__transformPointEvent'](ev)
    }

    @action_hook
    globalTouchMove(ev: TouchMoveEvent): void {
        this['__transformPointEvent'](ev)
    }

    @action_hook
    onGlobalClick(ev: ClickEvent): void {
        this['__transformPointEvent'](ev)
    }

    private __transformPointEvent(
        ev: MouseDownEvent | MouseUpEvent | MouseMoveEvent | ClickEvent
    ): void {
        ev.x -= this.position.x
        ev.y -= this.position.y
    }
}
