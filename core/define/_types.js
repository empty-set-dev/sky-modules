var lib;
(function (lib) {
    function read(schema) {
        return schema;
    }
    lib.read = read;
    function write(schema) {
        return schema;
    }
    lib.write = write;
    function secret(schema) {
        return schema;
    }
    lib.secret = secret;
    // eslint-disable-next-line no-constant-condition
    if (false) {
        boolean.type = undefined;
    }
    function boolean(target, key) {
        var _a;
        (_a = target.schema) !== null && _a !== void 0 ? _a : (target.schema = {});
        target.schema[key] = boolean;
    }
    lib.boolean = boolean;
    // eslint-disable-next-line no-constant-condition
    if (false) {
        number.type = undefined;
    }
    function number(target, key) {
        var _a;
        (_a = target.schema) !== null && _a !== void 0 ? _a : (target.schema = {});
        target.schema[key] = number;
    }
    lib.number = number;
    // eslint-disable-next-line no-constant-condition
    if (false) {
        string.type = undefined;
    }
    function string(target, key) {
        var _a;
        (_a = target.schema) !== null && _a !== void 0 ? _a : (target.schema = {});
        target.schema[key] = string;
    }
    lib.string = string;
    function object(schema) {
        return (target, key) => {
            var _a;
            (_a = target.schema) !== null && _a !== void 0 ? _a : (target.schema = {});
            target.schema[key] = schema;
        };
    }
    lib.object = object;
    function array(type) {
        return (target, key) => {
            var _a;
            (_a = target.schema) !== null && _a !== void 0 ? _a : (target.schema = {});
            target.schema[key] = type;
        };
    }
    lib.array = array;
    function func(target, key) {
        var _a;
        (_a = target.schema) !== null && _a !== void 0 ? _a : (target.schema = {});
        target.schema[key] = (func);
    }
    lib.func = func;
    optional.boolean = optional(boolean);
    optional.number = optional(number);
    optional.string = optional(string);
    optional.func = optional(func);
    function optional(schema) {
        return schema;
    }
    lib.optional = optional;
    nullable.boolean = nullable(boolean);
    nullable.number = nullable(number);
    nullable.string = nullable(string);
    nullable.func = nullable(func);
    function nullable(schema) {
        return schema;
    }
    lib.nullable = nullable;
    nullish.boolean = nullish(boolean);
    nullish.number = nullish(number);
    nullish.string = nullish(string);
    nullish.func = nullish(func);
    function nullish(schema) {
        return schema;
    }
    lib.nullish = nullish;
})(lib || (lib = {}));
Object.assign(global, lib);
export {};
//# sourceMappingURL=_types.js.map