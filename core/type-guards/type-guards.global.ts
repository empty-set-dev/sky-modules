import globalify from '@sky-modules/core/globalify'

import * as imports from './type-guards'

declare global {
    const isUndefined: typeof imports.isUndefined
    type isUndefined = typeof imports.isUndefined
    const asUndefined: typeof imports.asUndefined
    type asUndefined = typeof imports.asUndefined
    const isNull: typeof imports.isNull
    type isNull = typeof imports.isNull
    const asNull: typeof imports.asNull
    type asNull = typeof imports.asNull
    const isNullish: typeof imports.isNullish
    type isNullish = typeof imports.isNullish
    const asNullish: typeof imports.asNullish
    type asNullish = typeof imports.asNullish
    const isBoolean: typeof imports.isBoolean
    type isBoolean = typeof imports.isBoolean
    const asBoolean: typeof imports.asBoolean
    type asBoolean = typeof imports.asBoolean
    const isNumber: typeof imports.isNumber
    type isNumber = typeof imports.isNumber
    const asNumber: typeof imports.asNumber
    type asNumber = typeof imports.asNumber
    const isBigInt: typeof imports.isBigInt
    type isBigInt = typeof imports.isBigInt
    const asBigInt: typeof imports.asBigInt
    type asBigInt = typeof imports.asBigInt
    const isSymbol: typeof imports.isSymbol
    type isSymbol = typeof imports.isSymbol
    const asSymbol: typeof imports.asSymbol
    type asSymbol = typeof imports.asSymbol
    const isString: typeof imports.isString
    type isString = typeof imports.isString
    const asString: typeof imports.asString
    type asString = typeof imports.asString
    const isTemplateStringsArray: typeof imports.isTemplateStringsArray
    type isTemplateStringsArray = typeof imports.isTemplateStringsArray
    const asTemplateStringsArray: typeof imports.asTemplateStringsArray
    type asTemplateStringsArray = typeof imports.asTemplateStringsArray
    const isArray: typeof imports.isArray
    type isArray = typeof imports.isArray
    const asArray: typeof imports.asArray
    type asArray = typeof imports.asArray
    const isObject: typeof imports.isObject
    type isObject = typeof imports.isObject
    const asObject: typeof imports.asObject
    type asObject = typeof imports.asObject
    const isFunction: typeof imports.isFunction
    type isFunction = typeof imports.isFunction
    const asFunction: typeof imports.asFunction
    type asFunction = typeof imports.asFunction
}

globalify({ ...imports })
