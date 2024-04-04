import globalify from '.'
import * as module from '.'

globalify({ globalify: module.default })

declare global {
    interface globalify {}
    const globalify: ((module: object) => void) & globalify
}
