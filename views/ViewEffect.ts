export default class ViewEffect extends Effect {
    view = new Three.Object3D()

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
        ev.x -= this.view.position.x
        ev.y -= this.view.position.y
    }
}
