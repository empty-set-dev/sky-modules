import { Object3D } from 'three'

export default class Sprite extends Object3D {
    readonly effect: Effect

    constructor(deps: EffectDeps) {
        super()

        this.effect = new Effect(deps, this)
    }

    @action_hook
    protected onGlobalMouseDown(ev: Sky.MouseDownEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    protected onGlobalMouseUp(ev: Sky.MouseUpEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    protected onGlobalMouseMove(ev: Sky.MouseMoveEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    protected globalTouchBegin(ev: Sky.TouchBeginEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    protected globalTouchEnd(ev: Sky.TouchEndEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    protected globalTouchMove(ev: Sky.TouchMoveEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    protected onGlobalClick(ev: Sky.ClickEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    private __transformPointEvent(
        ev: Sky.MouseDownEvent | Sky.MouseUpEvent | Sky.MouseMoveEvent | Sky.ClickEvent
    ): void {
        ev.x -= this.position.x
        ev.y -= this.position.y
    }
}
