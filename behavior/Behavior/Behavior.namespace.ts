import 'sky/jsx/global'

declare global {
    namespace Behavior {
        interface SlotRootProps<T> {
            passive?: boolean
            controller?: T
        }
    }
}
