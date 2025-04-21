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
    onGlobalMouseDown(ev: MouseDownEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    onGlobalMouseUp(ev: MouseUpEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    onGlobalMouseMove(ev: MouseMoveEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    globalTouchBegin(ev: TouchBeginEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    globalTouchEnd(ev: TouchEndEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    globalTouchMove(ev: TouchMoveEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    @action_hook
    onGlobalClick(ev: ClickEvent, emitEvent: () => void): void {
        this['__transformPointEvent'](ev)
        emitEvent()
    }

    private __transformPointEvent(
        ev: MouseDownEvent | MouseUpEvent | MouseMoveEvent | ClickEvent
    ): void {
        ev.x -= this.position.x
        ev.y -= this.position.y
    }
}
