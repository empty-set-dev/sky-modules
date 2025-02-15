import { Object3D } from 'three'

export default class Sprite extends Effect {
    position: Vector2 = new Vector2()
    view: Object3D = new Object3D()

    @action_hook
    mouseDown(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    mouseUp(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    mouseMove(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    touchBegin(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    touchEnd(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    touchMove(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    @action_hook
    click(ev: MouseDownEvent): void {
        this.__transformPointEvent(ev)
    }

    __transformPointEvent(ev: MouseDownEvent | MouseUpEvent | MouseMoveEvent | ClickEvent): void {
        ev.x -= this.position.x
        ev.y -= this.position.y
    }
}
