import globalify from '.'
import * as lib from '.'

declare global {
    namespace globalify {
        namespace(namespace: string, lib: object): void
    }

    const globalify: typeof lib.globa
}

globalify({ globalify: lib.default })
