import globalify from '.'
import * as pkg from '.'

globalify({ globalify: pkg.default })

declare global {
    interface globalify {}
    const globalify: ((pkg: object) => void) & globalify
}
