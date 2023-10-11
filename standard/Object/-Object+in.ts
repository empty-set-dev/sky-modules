export {}

declare global {
    interface Object {
        in<G>(link: Effects, group: G): this
    }
}

Object.prototype.in = function <G>(link: Effects, group: G): Object {
    ;(group as { has }).has(link, this)
    return this
}
