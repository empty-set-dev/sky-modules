import { Object3D } from 'three'

export default class Sprite extends Object3D {
    readonly effect: Effect

    constructor(deps: EffectDeps) {
        super()

        this.effect = new Effect(deps, this)
    }

    @hook
    protected onGlobalMouseDown(ev: Sky.MouseDownEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalMouseUp(ev: Sky.MouseUpEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalMouseMove(ev: Sky.MouseMoveEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected globalTouchBegin(ev: Sky.TouchBeginEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected globalTouchEnd(ev: Sky.TouchEndEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected globalTouchMove(ev: Sky.TouchMoveEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalClick(ev: Sky.ClickEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    private __transformPointEvent(ev: Sky.MouseEvent | Sky.TouchEvent): void {
        ev.x -= this.position.x
        ev.y -= this.position.y
    }
}
