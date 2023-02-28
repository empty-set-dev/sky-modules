import local from './default'
import globalify from './globalify'
export * from './local'
export default globalify
globalify(globalify)

declare global {
    type globalify = local.globalify
    function globalify(module: object, target?: object | string): void
}
