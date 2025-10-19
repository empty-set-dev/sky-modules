import local from './local'

const assign = Object.assign
const defineProperties = Object.defineProperties

export default function makePlain<T extends object>(
    schema: T
): (this: Plain<T> & object, object: Plain<T> & object) => Plain<T> {
    const propertiesMap = local.reactivePropertyDescriptors(schema) as Record<
        string,
        PropertyDescriptor & { constructor: Function }
    >

    function Object(this: Plain<T> & object, object: Plain<T> & object): Plain<T> {
        assign(this, object)
        return this
    }
    Object.schema = schema
    Object.prototype = defineProperties({ constructor: Object }, propertiesMap) as {
        constructor: typeof Object
    } & local.Static
    return Object
}
