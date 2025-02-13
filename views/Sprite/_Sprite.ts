export default class Sprite extends Effect {
    position: Vector2 = new Vector2()

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
        e.x -= this.position.x
        e.y -= this.position.y
    }
}
