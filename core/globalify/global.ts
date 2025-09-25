import globalify from '.'
import * as lib from '.'

globalify({ globalify: lib.default })

declare global {
    interface globalify {
        namespace(namespace: string, lib: object): void
    }

    const globalify: ((lib: object) => void) & globalify
}
