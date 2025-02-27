import { Object3D } from 'three'

export default class Sprite extends Effect {
    view: Object3D = new Object3D()

    @action_hook
    globalMouseDown(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    globalMouseUp(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    globalMouseMove(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    globalTouchBegin(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    globalTouchEnd(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    globalTouchMove(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    globalClick(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    __transformPointEvent(ev: MouseDownEvent | MouseUpEvent | MouseMoveEvent | ClickEvent): void {
        ev.x -= this.view.position.x
        ev.y -= this.view.position.y
    }
}
