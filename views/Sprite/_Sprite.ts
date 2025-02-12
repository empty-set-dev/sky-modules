export default class Sprite extends Effect {
    position: Vector2 = new Vector2()

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
        e.x -= this.position.x
        e.y -= this.position.x
    }
}
