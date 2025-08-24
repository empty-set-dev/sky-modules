import local from './__local'

export default function makePlain<T extends object>(
    schema: T
): (this: Plain<T> & object, object: Plain<T> & object) => Plain<T> {
    const propertiesMap = local.reactivePropertyDescriptors(schema) as Record<
        string,
        PropertyDescriptor & { constructor: Function }
    >
    const prototype = Object.defineProperties({ constructor: plain }, propertiesMap) as {
        constructor: typeof plain
    } & local.Static
    function plain(this: Plain<T> & object, object: Plain<T> & object): Plain<T> {
        Object.assign(this, object)
        return this
    }
    plain.prototype = prototype
    return plain
}
