import globalify, * as lib from './_globalify'

declare global {
    const globalify: typeof lib.default
}

globalify({ globalify, ...lib })
