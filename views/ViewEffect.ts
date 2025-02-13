export default class ViewEffect extends Effect {
    view = new Three.Object3D()

    @action_hook
    mouseDown(ev: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    mouseUp(ev: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    mouseMove(ev: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    touchBegin(ev: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    touchEnd(ev: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    touchMove(ev: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    click(ev: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    __transformPointEvent(ev: MouseDownEvent | MouseUpEvent | MouseMoveEvent | ClickEvent): void {
        e.x -= this.view.position.x
        e.y -= this.view.position.y
    }
}
