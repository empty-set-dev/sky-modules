import globalify from 'sky/utilities/globalify'

declare global {
    interface Event {
        isCaptured: boolean
    }

    // mouse
    interface MouseDownEvent extends Event {
        x: number
        y: number
        button: MouseButton
    }

    interface MouseUpEvent extends Event {
        x: number
        y: number
        button: MouseButton
    }

    interface MouseMoveEvent extends Event {
        x: number
        y: number
    }

    interface ScrollEvent extends Event {
        delta: number
    }

    // keyboard
    interface KeyboardDownEvent extends Event {
        code: KeyboardEvent['code']
    }

    interface KeyboardUpEvent extends Event {
        code: KeyboardEvent['code']
    }

    interface KeyboardPressEvent extends Event {
        code: KeyboardEvent['code']
    }

    // touch
    interface TouchBeginEvent extends Event {
        index: number
        x: number
        y: number
    }

    interface TouchEndEvent extends Event {
        index: number
        x: number
        y: number
    }

    interface TouchMoveEvent extends Event {
        index: number
        x: number
        y: number
    }

    //
    interface ClickEvent extends Event {
        x: number
        y: number
    }

    interface UpdateEvent extends Event {
        dt: number
    }

    interface UpdateZOrderEvent extends Event {
        z: number
    }

    enum MouseButton {
        LEFT,
        MIDDLE,
        RIGHT,
    }
}

globalify({
    MouseButton,
})
