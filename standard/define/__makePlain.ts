import local from './__local'

export default function makePlain<T extends object>(
    schema: T
): (this: Plain<T> & object, object: Plain<T> & object) => Plain<T> {
    const propertiesMap = local.reactivePropertyDescriptors(schema) as Record<
        string,
        PropertyDescriptor & { constructor: Function }
    >
    const prototype = Object.defineProperties({}, propertiesMap)
    function constructor(this: Plain<T> & object, object: Plain<T> & object): Plain<T> {
        Object.assign(this, object)
        return this
    }
    constructor.prototype = prototype
    return constructor
}
