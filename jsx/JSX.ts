export * from 'solid-js'

namespace JSX {
    export type FC<P = {}> = (props: P) => JSX.Element

    export type Node = Element | Element[] | string | number | boolean | bigint | null | undefined

    export interface Element {
        type: string | Function
        key: null | string
        props: object
        children?: Node
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Return = any
}

export default JSX
