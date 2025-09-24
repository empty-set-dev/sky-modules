export {}

declare global {
    namespace JSX {
        interface Element {
            type: string | Function
            props: Record<string, unknown>
            children?: Element[]
        }
    }
}
