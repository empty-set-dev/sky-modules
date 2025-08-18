import { Object3D } from 'three'

export default class Sprite extends Object3D {
    static super(self: Sprite, deps: EffectDeps): void {
        Sprite.call(self, deps)
    }

    readonly effect: Effect

    constructor(deps: EffectDeps) {
        super()

        this.effect ??= new Effect(deps, this)
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
    protected onGlobalTouchBegin(ev: Sky.TouchBeginEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalTouchEnd(ev: Sky.TouchEndEvent, next: () => void): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalTouchMove(ev: Sky.TouchMoveEvent, next: () => void): void {
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
