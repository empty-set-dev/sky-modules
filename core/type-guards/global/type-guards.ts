import globalify from '@sky-modules/core/globalify'

import * as imports from '../type-guards'

declare global {
    const isUndefined: typeof imports.isUndefined
    const asUndefined: typeof imports.asUndefined
    const isNull: typeof imports.isNull
    const asNull: typeof imports.asNull
    const isNullish: typeof imports.isNullish
    const asNullish: typeof imports.asNullish
    const isBoolean: typeof imports.isBoolean
    const asBoolean: typeof imports.asBoolean
    const isNumber: typeof imports.isNumber
    const asNumber: typeof imports.asNumber
    const isBigInt: typeof imports.isBigInt
    const asBigInt: typeof imports.asBigInt
    const isSymbol: typeof imports.isSymbol
    const asSymbol: typeof imports.asSymbol
    const isString: typeof imports.isString
    const asString: typeof imports.asString
    const isTemplateStringsArray: typeof imports.isTemplateStringsArray
    const asTemplateStringsArray: typeof imports.asTemplateStringsArray
    const isArray: typeof imports.isArray
    const asArray: typeof imports.asArray
    const isObject: typeof imports.isObject
    const asObject: typeof imports.asObject
    const isFunction: typeof imports.isFunction
    const asFunction: typeof imports.asFunction
}

globalify({ ...imports })
