import globalify from '.'
import * as pkg from '.'

globalify({ globalify: pkg.default })

declare global {
    interface globalify {
        namespace(namespace: string, module: object): void
    }

    const globalify: ((module: object) => void) & globalify
}
