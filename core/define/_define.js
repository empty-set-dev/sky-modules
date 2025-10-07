import local from './__local';
var lib;
(function (lib) {
    define('sky.core.define', define);
    function define(name, value) {
        if (local.defines[name] != null && (!isRuntime || !isHot())) {
            throw new Error(`duplicate define ${name}`);
        }
        if (isRuntime) {
            if (!isHot()) {
                throw new Error('runtime define');
            }
        }
        if (value != null) {
            const define = {
                name,
            };
            if (typeof value === 'object') {
                as(value);
                define.value = value;
                define.value[local.typeSymbol] = Array.isArray(value) ? 'array' : 'object';
            }
            else if (typeof value === 'function') {
                as(value);
                define.value = value;
                define.value[local.typeSymbol] = 'func';
            }
            else {
                throw new Error('unknown type');
            }
            define.value[local.nameSymbol] = name.split('.').pop();
            define.value[local.uidSymbol] = name;
            local.defines[name] = define;
            return value;
        }
        return function define(Target) {
            var _a;
            var _b;
            if (isRuntime) {
                if (!isHot()) {
                    throw new Error('runtime define');
                }
            }
            as(Target);
            (_a = (_b = Target.prototype).schema) !== null && _a !== void 0 ? _a : (_b.schema = {});
            Target[local.typeSymbol] = 'class';
            Target[local.nameSymbol] = Target.name;
            Target[local.uidSymbol] = name;
            local.defines[name] = {
                name,
                value: Target,
            };
            const propertiesMap = local.reactivePropertyDescriptors(Target.prototype.schema);
            Object.defineProperties(Target.prototype, propertiesMap);
        };
    }
    lib.define = define;
    function schema(name, schema) {
        as(schema);
        if (Array.isArray(schema) || typeof schema !== 'object') {
            throw new Error('schema can be only object');
        }
        const constructor = local.makePlain(schema);
        schema[local.constructorSymbol] = constructor;
        const define = {
            name,
            value: constructor,
            [local.typeSymbol]: 'schema',
        };
        define.value[local.nameSymbol] = name.split('.').pop();
        define.value[local.uidSymbol] = name;
        local.defines[name] = define;
        return schema;
    }
    lib.schema = schema;
})(lib || (lib = {}));
Object.assign(global, lib);
//# sourceMappingURL=_define.js.map