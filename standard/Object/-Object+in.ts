export {}

declare global {
    interface Object {
        in<G>(group: G): this
    }
}

Object.prototype.in = function <G>(group: G): Object {
    ;(group as { has }).has(this)
    return this
}
