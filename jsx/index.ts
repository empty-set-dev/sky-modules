namespace JSX {
    export type Node = Element | Element[] | string | number | boolean | bigint | null | undefined

    export interface Element {
        type: string | Function
        key: null | string
        props: Record<string, unknown>
        children?: Node
    }
}

export default JSX
