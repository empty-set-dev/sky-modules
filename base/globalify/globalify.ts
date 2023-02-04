import {types} from 'types/local'
declare const global: types.Object

export type globalify = typeof globalify
export function globalify(module: object, target: object|string = global) {
    if (typeof target === 'string') {
        target = global[target] = global[target] || {}
    }
    Object.assign(target, module)
}
