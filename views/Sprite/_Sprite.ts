import { Object3D } from 'three'

export default class Sprite extends Object3D {
    readonly effect: SpriteEffect

    constructor(deps: EffectDeps) {
        super()

        this.effect = new SpriteEffect(this, deps)
    }

    private __transformPointEvent(
        ev: MouseDownEvent | MouseUpEvent | MouseMoveEvent | ClickEvent
    ): void {
        ev.x -= this.position.x
        ev.y -= this.position.y
    }
}

class SpriteEffect extends Effect {
    readonly sprite: Sprite

    constructor(sprite: Sprite, deps: EffectDeps) {
        super(deps)

        this.sprite = sprite
    }

    @action_hook
    onGlobalMouseDown(ev: MouseDownEvent): void {
        this.sprite['__transformPointEvent'](ev)
    }

    @action_hook
    onGlobalMouseUp(ev: MouseUpEvent): void {
        this.sprite['__transformPointEvent'](ev)
    }

    @action_hook
    onGlobalMouseMove(ev: MouseMoveEvent): void {
        this.sprite['__transformPointEvent'](ev)
    }

    @action_hook
    globalTouchBegin(ev: TouchBeginEvent): void {
        this.sprite['__transformPointEvent'](ev)
    }

    @action_hook
    globalTouchEnd(ev: TouchEndEvent): void {
        this.sprite['__transformPointEvent'](ev)
    }

    @action_hook
    globalTouchMove(ev: TouchMoveEvent): void {
        this.sprite['__transformPointEvent'](ev)
    }

    @action_hook
    onGlobalClick(ev: ClickEvent): void {
        this.sprite['__transformPointEvent'](ev)
    }
}
