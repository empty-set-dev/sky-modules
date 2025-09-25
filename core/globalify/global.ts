import globalify, * as lib from '.'

declare global {
    const globalify: typeof lib.default
}

globalify({ globalify })
