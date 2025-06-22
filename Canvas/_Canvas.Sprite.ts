import Vector2 from 'sky/math/Vector2'

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

        @action_hook
        protected onGlobalMouseDown(ev: Sky.MouseDownEvent, next: () => void): void {
            this.__onPointEvent(ev, next)
        }

        @action_hook
        protected onGlobalMouseUp(ev: Sky.MouseUpEvent, next: () => void): void {
            this.__onPointEvent(ev, next)
        }

        @action_hook
        protected onGlobalMouseMove(ev: Sky.MouseMoveEvent, next: () => void): void {
            this.__onPointEvent(ev, next)
        }

        @action_hook
        protected globalTouchBegin(ev: Sky.TouchBeginEvent, next: () => void): void {
            this.__onPointEvent(ev, next)
        }

        @action_hook
        protected globalTouchEnd(ev: Sky.TouchEndEvent, next: () => void): void {
            this.__onPointEvent(ev, next)
        }

        @action_hook
        protected globalTouchMove(ev: Sky.TouchMoveEvent, next: () => void): void {
            this.__onPointEvent(ev, next)
        }

        @action_hook
        protected onGlobalClick(ev: Sky.ClickEvent, next: () => void): void {
            this.__onPointEvent(ev, next)
        }

        @action_hook
        protected beforeDraw(ev: Sky.DrawEvent, next: () => void): void {
            ev.x += this.position.x
            ev.y += this.position.y

            next()
        }

        @action_hook
        protected draw(ev: Sky.DrawEvent, next: () => void): void {
            ev.x += this.position.x
            ev.y += this.position.y

            next()
        }

        @action_hook
        protected afterDraw(ev: Sky.DrawEvent, next: () => void): void {
            ev.x += this.position.x
            ev.y += this.position.y

            next()
        }

        private __onPointEvent(ev: Sky.MouseEvent | Sky.TouchEvent, next: () => void): void {
            ev.x -= this.position.x
            ev.y -= this.position.y

            next()

            if (!ev.isCaptured) {
                if (ev.x >= 0 && ev.x <= this.w && ev.y >= 0 && ev.y <= this.h) {
                    ev.isCaptured = true
                }
            }
        }
    }
}

globalify.namespace('Canvas', lib)
