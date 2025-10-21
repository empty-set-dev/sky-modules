import globalify from '../globalify'

declare global {
    namespace Sky {
        type EventHandler = (event: Sky.Event) => void

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

        // gamepad
        interface GamepadEvent extends Event {
            index: number
        }

        interface GamepadConnectedEvent extends GamepadEvent {}

        interface GamepadDisconnectedEvent extends GamepadEvent {}

        interface GamepadButtonEvent extends GamepadEvent {
            button: number
            value: number
            pressed: boolean
        }

        interface GamepadButtonDownEvent extends GamepadButtonEvent {}

        interface GamepadButtonUpEvent extends GamepadButtonEvent {}

        interface GamepadAxisEvent extends GamepadEvent {
            axis: number
            value: number
        }

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

        type MouseButton = lib.MouseButton
        const MouseButton: typeof lib.MouseButton
    }
}

namespace lib {
    export enum MouseButton {
        LEFT = 0,
        MIDDLE = 1,
        RIGHT = 2,
    }
}

globalify.namespace('Sky', lib)
