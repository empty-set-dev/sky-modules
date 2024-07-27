import globalify from '.'
import * as lib from '.'

globalify({ globalify: lib.default })

declare global {
    interface globalify {}
    const globalify: ((lib: object) => void) & globalify
}
