namespace Mitosis {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Node = any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type Children = any
    export type Ref = unknown
    export type FC<P = {}> = (props: P & { children?: Children }) => Node
}

export default Mitosis
