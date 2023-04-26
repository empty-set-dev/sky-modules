import * as local from './defaultly'
import globalify from './globalify'

globalify(local)

declare global {
    type globalify = local.default
    function globalify(module: object, target?: object | string): void
}
