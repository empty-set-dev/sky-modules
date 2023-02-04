import local from './default'
import { globalify } from './local'
globalify(local)

declare global {
    type globalify = local.globalify
    function globalify(module: object, target?: object|string): void
}
