export default class ViewEffect extends Effect {
    view = new Three.Object3D()

    @action_hook
    mouseDown(e: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    mouseUp(e: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    mouseMove(e: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    touchBegin(e: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    touchEnd(e: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    touchMove(e: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    @action_hook
    click(e: MouseDownEvent): void {
        this.__transformPointEvent(e)
    }

    __transformPointEvent(e: MouseDownEvent | MouseUpEvent | MouseMoveEvent | ClickEvent): void {
        e.x -= this.view.position.x
        e.y -= this.view.position.y
    }
}
