import globalify from 'sky/utilities/globalify'

declare global {
    class Enability {
        static super(self: Enability): void
        enabled: boolean
    }
    const enability: typeof lib.enability
    class Visibility {
        static super(self: Visibility): void
        visible: boolean
    }
    const visibility: typeof lib.visibility
}

namespace lib {
    export class Enability {
        static super(self: Enability): void {
            self.enabled = true
        }

        enabled!: boolean

        @action_hook
        protected onAny(eventName: string, ev: Sky.Event, next: Function): void {
            if (this.enabled) {
                next()
            }
        }
    }
    export const enability = action_hook_mixin(Enability)

    export class Visibility {
        static super(self: Visibility): void {
            self.visible = true
        }

        visible!: boolean

        @action_hook
        protected onAny(eventName: string, ev: Sky.Event, next: Function): void {
            if (
                eventName === 'beforeUpdate' ||
                eventName === 'update' ||
                eventName === 'afterUpdate' ||
                this.visible
            ) {
                next()
            }
        }
    }
    export const visibility = action_hook_mixin(Visibility)
}

globalify(lib)
