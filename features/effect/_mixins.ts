import globalify from 'sky/utilities/globalify'

declare global {
    class Enability extends lib.Enability {}
    class Visibility extends lib.Visibility {}
}

namespace lib {
    export class Enability {
        static super(self: Enability): void {
            self.enabled = true
        }

        enabled!: boolean

        @hook
        protected onAny(
            next: (this: Enability, ev: Sky.Event) => void,
            eventName: string,
            ev: Sky.Event
        ): void {
            if (this.enabled) {
                next.call(this, ev)
            }
        }
    }

    export class Visibility {
        static super(self: Visibility): void {
            self.visible = true
        }

        visible!: boolean

        @hook
        protected onAny(
            next: (this: Visibility, ev: Sky.Event) => void,
            eventName: string,
            ev: Sky.Event
        ): void {
            if (
                eventName === 'beforeUpdate' ||
                eventName === 'update' ||
                eventName === 'afterUpdate' ||
                this.visible
            ) {
                next.call(this, ev)
            }
        }
    }
}

globalify(lib)
