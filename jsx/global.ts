export {}

declare global {
    namespace JSX {
        type Node = string | Element | Element[]

        interface Element {
            type: string | Function
            key: string
            props: Record<string, unknown>
            children?: Node
        }
    }

    type UC = JSX.Node
}
