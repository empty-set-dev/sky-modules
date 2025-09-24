export {}

declare global {
    namespace JSX {
        type Node = string | Element | Element[]

        interface Element {
            type: string | Function
            props: Record<string, unknown>
            children?: Node
        }
    }
}
