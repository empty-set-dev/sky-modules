import Vector2 from 'sky/math/Vector2'
import globalify from 'sky/utilities/globalify'

declare global {
    namespace Sky {
        interface Event {
            isCaptured: boolean
        }

        // mouse
        interface MouseEvent extends Event {
            x: number
            y: number
        }
        interface MouseDownEvent extends MouseEvent {
            button: MouseButton
        }

        interface MouseUpEvent extends MouseEvent {
            button: MouseButton
        }

        interface MouseMoveEvent extends MouseEvent {}

        interface ScrollEvent extends Event {
            x: number
            y: number
            z: number
        }

        // keyboard
        interface KeyboardEvent extends Event {
            code: globalThis.KeyboardEvent['code']
            altKey: globalThis.KeyboardEvent['altKey']
        }
        interface KeyboardDownEvent extends KeyboardEvent {}

        interface KeyboardUpEvent extends KeyboardEvent {}

        interface KeyboardPressEvent extends KeyboardEvent {}

        // touch
        interface TouchEvent extends Event {
            index: number
            x: number
            y: number
        }
        interface TouchBeginEvent extends TouchEvent {}

        interface TouchEndEvent extends TouchEvent {}

        interface TouchMoveEvent extends TouchEvent {}

        //
        interface ClickEvent extends MouseEvent {}

        interface UpdateEvent extends Event {
            dt: number
        }

        interface DrawEvent extends Event {
            x: number
            y: number
            opacity: number
            visible: boolean
        }

        interface UpdateZOrderEvent extends Event {
            z: number
        }

        type MouseButton = SkyModule.MouseButton
        const MouseButton: typeof SkyModule.MouseButton
    }
}

namespace SkyModule {
    export enum MouseButton {
        LEFT = 0,
        MIDDLE = 1,
        RIGHT = 2,
    }
}

globalify.namespace('Sky', SkyModule)
