export default JSX
namespace JSX {
    type Node = Element | Element[] | string | number | boolean | bigint | null | undefined

    interface Element {
        type: string | Function
        key: null | string
        props: Record<string, unknown>
        children?: Node
    }
}
