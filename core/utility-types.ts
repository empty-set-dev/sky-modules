export {}

declare global {
    type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends (
        k: infer I
    ) => void
        ? I
        : never

    type UnionToTuple<U> =
        UnionToIntersection<U extends unknown ? (u: U) => void : never> extends (v: infer V) => void
            ? [...UnionToTuple<Exclude<U, V>>, V]
            : []
}
