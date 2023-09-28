import Object from 'types/Object'

export default globalify

declare const global: Object

type globalify = typeof globalify
function globalify(module: object, target: object | string = global): void {
    if (typeof target === 'string') {
        target = (global[target] as object) ??= {}
    }

    Object.assign(target, module)
}
