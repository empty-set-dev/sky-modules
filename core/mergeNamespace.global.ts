import mergeNamespace, * as lib from './mergeNamespace'

declare global {
    const mergeNamespace: typeof lib.default
}

Object.assign(global, { mergeNamespace, ...lib })
