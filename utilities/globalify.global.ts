import * as module from './globalify/globalify'
import globalify from './globalify/globalify'

globalify({ globalify: module.default })

declare global {
    interface globalify {}
    const globalify: ((module: object) => void) & globalify
}
