import { Object3D } from 'three'

export default class Sprite extends Object3D {
    readonly effect: Effect

    constructor(deps: EffectDeps) {
        super()

        this.effect = new Effect(deps, this)
    }

    @action_hook
    protected onGlobalMouseDown(ev: Sky.MouseDownEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @action_hook
    protected onGlobalMouseUp(ev: Sky.MouseUpEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @action_hook
    protected onGlobalMouseMove(ev: Sky.MouseMoveEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @action_hook
    protected globalTouchBegin(ev: Sky.TouchBeginEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @action_hook
    protected globalTouchEnd(ev: Sky.TouchEndEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @action_hook
    protected globalTouchMove(ev: Sky.TouchMoveEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @action_hook
    protected onGlobalClick(ev: Sky.ClickEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    private __transformPointEvent(ev: Sky.MouseEvent | Sky.TouchEvent): void {
        ev.x -= this.position.x
        ev.y -= this.position.y
    }
}
