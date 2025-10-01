import mergeNamespace, * as lib from '.'

declare global {
    const mergeNamespace: typeof lib.default
}

Object.assign(global, { mergeNamespace, ...lib })
