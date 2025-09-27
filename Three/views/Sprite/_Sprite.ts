import { Object3D } from 'three'

namespace local {
    export const object3D = new Object3D()
}

// @mixin(Vector2)
interface Sprite extends Vector2 {}
class Sprite extends Object3D {
    readonly effect: Effect

    get x(): number {
        return this.position.x
    }
    set x(x: number) {
        this.position.setX(x)
    }
    get y(): number {
        return this.position.y
    }
    set y(y: number) {
        this.position.setY(y)
    }
    get z(): number {
        return this.position.z
    }
    set z(z: number) {
        this.position.setZ(z)
    }

    static super(self: Sprite, deps: EffectDeps): void {
        Object3D.prototype.copy.call(self, local.object3D)
        self.effect == null && Object.assign(self, { effect: new Effect(deps, self) })
    }

    constructor(deps: EffectDeps) {
        super()

        this.effect ??= new Effect(deps, this)
    }

    @hook
    protected static onGlobalMouseDown(
        this: Sprite,
        next: () => void,
        ev: Sky.MouseDownEvent
    ): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected static onGlobalMouseUp(this: Sprite, next: () => void, ev: Sky.MouseUpEvent): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected static onGlobalMouseMove(
        this: Sprite,
        next: () => void,
        ev: Sky.MouseMoveEvent
    ): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected static onGlobalTouchBegin(
        this: Sprite,
        next: () => void,
        ev: Sky.TouchBeginEvent
    ): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected static onGlobalTouchEnd(this: Sprite, next: () => void, ev: Sky.TouchEndEvent): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected static onGlobalTouchMove(
        this: Sprite,
        next: () => void,
        ev: Sky.TouchMoveEvent
    ): void {
        this.__transformPointEvent(ev)
        next()
    }

    @hook
    protected static onGlobalClick(this: Sprite, next: () => void, ev: Sky.ClickEvent): void {
        this.__transformPointEvent(ev)
        next()
    }

    private __transformPointEvent(ev: Sky.MouseEvent | Sky.TouchEvent): void {
        ev.x -= this.position.x
        ev.y -= this.position.y
    }
}
export default Sprite
