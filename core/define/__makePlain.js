import local from './__local';
const assign = Object.assign;
const defineProperties = Object.defineProperties;
export default function makePlain(schema) {
    const propertiesMap = local.reactivePropertyDescriptors(schema);
    function Object(object) {
        assign(this, object);
        return this;
    }
    Object.schema = schema;
    Object.prototype = defineProperties({ constructor: Object }, propertiesMap);
    return Object;
}
//# sourceMappingURL=__makePlain.js.map