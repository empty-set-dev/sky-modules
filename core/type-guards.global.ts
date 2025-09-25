import globalify from 'sky/core/globalify'

import * as lib from './type-guards'

declare global {
    const isUndefined: typeof lib.isUndefined
    const asUndefined: typeof lib.asUndefined
    const isNull: typeof lib.isNull
    const asNull: typeof lib.asNull
    const isNullish: typeof lib.isNullish
    const asNullish: typeof lib.asNullish
    const isBoolean: typeof lib.isBoolean
    const asBoolean: typeof lib.asBoolean
    const isNumber: typeof lib.isNumber
    const asNumber: typeof lib.asNumber
    const isBigInt: typeof lib.isBigInt
    const asBigInt: typeof lib.asBigInt
    const isSymbol: typeof lib.isSymbol
    const asSymbol: typeof lib.asSymbol
    const isString: typeof lib.isString
    const asString: typeof lib.asString
    const isTemplateStringsArray: typeof lib.isTemplateStringsArray
    const asTemplateStringsArray: typeof lib.asTemplateStringsArray
    const isArray: typeof lib.isArray
    const asArray: typeof lib.asArray
    const isObject: typeof lib.isObject
    const asObject: typeof lib.asObject
    const isFunction: typeof lib.isFunction
    const asFunction: typeof lib.asFunction
}

globalify({ ...lib })
