import globalify from '.'
import * as module from '.'

globalify({ globalify: module.default })

declare global {
    interface globalify {
        namespace(namespace: string, module: object): void
    }

    const globalify: ((module: object) => void) & globalify
}
