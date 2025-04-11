import globalify from '.'
import * as pkg from '.'

globalify({ globalify: pkg.default })

declare global {
    interface globalify {
        namespace(namespace: string, lib: object): void
    }

    const globalify: ((pkg: object) => void) & globalify
}
