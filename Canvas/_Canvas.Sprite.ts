import Vector2 from '@sky-modules/math/Vector2'

declare global {
    namespace Canvas {
        class Sprite extends lib.Sprite {}
    }
}

export namespace lib {
    export class Sprite {
        readonly effect: Effect
        position: Vector2 = new Vector2()
        w: number = 0
        h: number = 0

        constructor(deps: EffectDeps) {
            this.effect = new Effect(deps, this)
        }

        @hook
        protected onGlobalMouseDown(
            next: (this: Sprite, ev: Sky.MouseDownEvent) => void,
            ev: Sky.MouseDownEvent
        ): void {
            this.__onPointEvent(next, ev)
        }

        @hook
        protected onGlobalMouseUp(
            next: (this: Sprite, ev: Sky.MouseUpEvent) => void,
            ev: Sky.MouseUpEvent
        ): void {
            this.__onPointEvent(next, ev)
        }

        @hook
        protected onGlobalMouseMove(
            next: (this: Sprite, ev: Sky.MouseMoveEvent) => void,
            ev: Sky.MouseMoveEvent
        ): void {
            this.__onPointEvent(next, ev)
        }

        @hook
        protected onGlobalTouchBegin(
            next: (this: Sprite, ev: Sky.TouchBeginEvent) => void,
            ev: Sky.TouchBeginEvent
        ): void {
            this.__onPointEvent(next, ev)
        }

        @hook
        protected onGlobalTouchEnd(
            next: (this: Sprite, ev: Sky.TouchEndEvent) => void,
            ev: Sky.TouchEndEvent
        ): void {
            this.__onPointEvent(next, ev)
        }

        @hook
        protected onGlobalTouchMove(
            next: (this: Sprite, ev: Sky.TouchMoveEvent) => void,
            ev: Sky.TouchMoveEvent
        ): void {
            this.__onPointEvent(next, ev)
        }

        @hook
        protected onGlobalClick(
            next: (this: Sprite, ev: Sky.ClickEvent) => void,
            ev: Sky.ClickEvent
        ): void {
            this.__onPointEvent(next, ev)
        }

        @hook
        protected beforeDraw(
            next: (this: Sprite, ev: Sky.DrawEvent) => void,
            ev: Sky.DrawEvent
        ): void {
            ev.x += this.position.x
            ev.y += this.position.y

            next.call(this, ev)
        }

        @hook
        protected draw(next: (this: Sprite, ev: Sky.DrawEvent) => void, ev: Sky.DrawEvent): void {
            ev.x += this.position.x
            ev.y += this.position.y

            next.call(this, ev)
        }

        @hook
        protected afterDraw(
            next: (this: Sprite, ev: Sky.DrawEvent) => void,
            ev: Sky.DrawEvent
        ): void {
            ev.x += this.position.x
            ev.y += this.position.y

            next.call(this, ev)
        }

        private __onPointEvent<T extends Sky.MouseEvent | Sky.TouchEvent>(
            next: (this: Sprite, ev: T) => void,
            ev: T
        ): void {
            ev.x -= this.position.x
            ev.y -= this.position.y

            next.call(this, ev)

            if (!ev.isCaptured) {
                if (ev.x >= 0 && ev.x <= this.w && ev.y >= 0 && ev.y <= this.h) {
                    ev.isCaptured = true
                }
            }
        }
    }
}

globalify.namespace('Canvas', lib)
