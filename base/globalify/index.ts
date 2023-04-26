import globalify from './`globalify'
import * as local from './defaultly'

globalify({ globalify: local.default })

declare global {
    type globalify = local.default
    function globalify(module: object, target?: object | string): void
}
