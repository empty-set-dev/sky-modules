import { Object3D } from 'three'

export default class Sprite extends Effect {
    view: Object3D

    constructor(deps: EffectDeps) {
        super(deps)
        this.view = new Object3D()
    }

    @action_hook
    onGlobalMouseDown(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    onGlobalMouseUp(ev: MouseUpEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    onGlobalMouseMove(ev: MouseMoveEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    globalTouchBegin(ev: TouchBeginEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    globalTouchEnd(ev: TouchEndEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    globalTouchMove(ev: TouchMoveEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    onGlobalClick(ev: ClickEvent): void {
        this.__transformPointEvent(ev)
    }

    __transformPointEvent(ev: MouseDownEvent | MouseUpEvent | MouseMoveEvent | ClickEvent): void {
        ev.x -= this.view.position.x
        ev.y -= this.view.position.y
    }
}
