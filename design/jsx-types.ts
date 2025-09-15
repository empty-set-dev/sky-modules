namespace JSX {
    export interface Element {
        type?: string | Function
        props?: { className?: string }
        children?: unknown
    }

    export interface PropsWithChildren {
        children: JSX.Element | JSX.Element[]
    }
}

export default JSX
