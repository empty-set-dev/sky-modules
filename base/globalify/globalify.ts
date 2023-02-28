import types from 'types'
export default globalify

declare const global: types.Object

type globalify = typeof globalify
function globalify(module: object, target: object | string = global) {
    if (typeof target === 'string') {
        target = global[target] ??= {}
    }

    Object.assign(target, module)
}
