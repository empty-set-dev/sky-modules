export default JSX
namespace JSX {
    export interface Element {
        type: string | Function
        props: Record<string, unknown>
        children?: Element[]
    }
}
