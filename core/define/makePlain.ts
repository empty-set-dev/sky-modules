import Internal from './internal/internal'
import reactivePropertyDescriptors from './reactive'
import reactive from './reactive'

import type { Plain } from './plain'

const assign = Object.assign
const defineProperties = Object.defineProperties

export default function makePlain<T extends object>(
    schema: T
): (this: Plain<T>, object: Plain<T>) => Plain<T> {
    const propertiesMap: Record<PropertyKey, unknown> = {}

    for (const [k, schema_] of Object.entries(schema)) {
        propertiesMap[k] = reactive(schema_)()
    }

    const propertiesMap = reactivePropertyDescriptors(schema)

    function Object(this: Plain<T> & object, object: Plain<T> & object): Plain<T> {
        assign(this, object)
        return this
    }
    Object.schema = schema
    Object.prototype = defineProperties({ constructor: Object }, propertiesMap) as {
        constructor: typeof Object
    } & Internal.Static
    return Object
}
