export {}

declare global {
    namespace JSX {
        // [ ] correct undefined order
        type Node = undefined | null | boolean | number | bigint | string | Element | Element[]

        interface Element {
            type: string | Function
            key: null | string
            props: Record<string, unknown>
            children?: Node
        }
    }
}
