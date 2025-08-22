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
    protected onGlobalMouseDown(next: () => void, ev: Sky.MouseDownEvent): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalMouseUp(next: () => void, ev: Sky.MouseUpEvent): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalMouseMove(next: () => void, ev: Sky.MouseMoveEvent): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalTouchBegin(next: () => void, ev: Sky.TouchBeginEvent): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalTouchEnd(next: () => void, ev: Sky.TouchEndEvent): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalTouchMove(next: () => void, ev: Sky.TouchMoveEvent): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected onGlobalClick(next: () => void, ev: Sky.ClickEvent): void {
        this.__transformPointEvent(ev)
        next()
    }

    private __transformPointEvent(ev: Sky.MouseEvent | Sky.TouchEvent): void {
        ev.x -= this.position.x
        ev.y -= this.position.y
    }
}
