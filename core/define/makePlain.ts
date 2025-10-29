import Internal from './internal/internal'
import { reactivePropertyDescriptorMap } from './reactive'

import type { Plain } from './plain'

export default function makePlain<T extends object>(
    schema: T
): (this: Plain<T>, object: Plain<T>) => Plain<T> {
    const propertiesMap = reactivePropertyDescriptorMap(schema)

    function object(this: Plain<T>, object: Plain<T>): Plain<T> {
        assume<object>(this)
        Object.assign(this, object)
        return this
    }
    object.schema = schema
    object.prototype = Object.defineProperties({ constructor: Object }, propertiesMap) as {
        constructor: typeof Object
    } & Internal.Static
    return object
}
