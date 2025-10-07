import local from './__local';
function toPrimitive(value) {
    if (typeof value === 'object' || typeof value === 'function') {
        as(value);
        if (value[local.idSymbol] == null) {
            throw typeof value === 'object' ? Error('unknown object') : Error('unknown function');
        }
        return value[local.idSymbol];
    }
    return value;
}
function commit(callback) {
    const plainUpdates = [];
    const plainCreateUpdates = [UpdateOfShared.Type.CREATE, []];
    plainUpdates[0] = plainCreateUpdates;
    const plainDestroyUpdates = [UpdateOfShared.Type.DESTROY, []];
    plainUpdates[1] = plainDestroyUpdates;
    const plainSetUpdates = [UpdateOfShared.Type.SET, []];
    plainUpdates[2] = plainSetUpdates;
    const prettyUpdates = {
        create: [],
        destroy: [],
        set: [],
    };
    callback.set.forEach((set, object) => {
        const prettySet = {};
        const keys = Object.keys(object.constructor.schema);
        set.forEach((value, i) => {
            const key = keys[i];
            prettySet[key] = value;
        });
        plainSetUpdates[1].push([
            object[local.idSymbol],
            set.reduce((array, value, i) => {
                return array.concat([i, toPrimitive(value)]);
            }, []),
        ]);
        prettyUpdates.set.push([
            object.constructor[local.uidSymbol],
            object[local.idSymbol],
            prettySet,
        ]);
    });
    callback(plainUpdates, prettyUpdates);
}
function queueCommit(callback) {
    callback.isWaitingCommit = true;
    task(async () => {
        await switch_thread();
        commit(callback);
    });
}
export default function reactivePropertyDescriptors(schema) {
    const propertiesMap = {};
    const schemaKeys = Object.keys(schema);
    schemaKeys.map((k, i) => {
        var _a;
        var _b;
        const property = schema[k];
        const valueSymbol = `${k}_`;
        if (typeof property === 'object') {
            (_a = property[_b = local.constructorSymbol]) !== null && _a !== void 0 ? _a : (property[_b] = local.makePlain(property));
        }
        function get_primitive() {
            // if (local.reactions.length > 0) {
            //     this[listenersSymbol] ??= new Set()
            //     const reaction = local.reactions.last()
            //     this[listenersSymbol].add(reaction)
            // }
            return this[valueSymbol];
        }
        function set_primitive(value) {
            // if (this[listenersSymbol] && this[listenersSymbol].size > 0) {
            //     this[listenersSymbol].forEach(reaction_ => {
            //         reaction(reaction_ as () => void)
            //     })
            // }
            if (this[local.listenersOfShared] != null) {
                const map = this[local.listenersOfShared];
                map.forEach((k, callback) => {
                    var _a;
                    as(callback);
                    (_a = callback.set) !== null && _a !== void 0 ? _a : (callback.set = new Map());
                    if (callback.set.has(this)) {
                        const set = callback.set.get(this);
                        set[i] = value;
                    }
                    else {
                        const set = [];
                        callback.set.set(this, set);
                        set[i] = value;
                    }
                    if (!callback.isWaitingCommit) {
                        queueCommit(callback);
                    }
                });
            }
            this[valueSymbol] = value;
        }
        function set_array_or_object(object) {
            if (!Array.isArray(object) && object.constructor.schema == null) {
                object = new property[local.constructorSymbol](object);
            }
            const previousObject = this[valueSymbol];
            if (this[local.listenersOfShared] != null) {
                if (previousObject != null) {
                    if (previousObject.constructor == null) {
                        throw NullError;
                    }
                    local.unobserve(previousObject, previousObject.constructor.schema, [
                        ...this[local.listenersOfShared].keys(),
                    ]);
                }
                if (object != null) {
                    local.observe(object, object.constructor.schema, [
                        ...this[local.listenersOfShared].keys(),
                    ]);
                }
            }
            set_primitive.call(this, object);
        }
        if (property == null) {
            //
        }
        else if (Array.isArray(property)) {
            propertiesMap[k] = {
                get: get_primitive,
                set: set_array_or_object,
                enumerable: true,
                configurable: true,
            };
        }
        else if (typeof property === 'object' || typeof property === 'function') {
            propertiesMap[k] = {
                get: get_primitive,
                set: set_array_or_object,
                enumerable: true,
                configurable: true,
            };
        }
        else {
            propertiesMap[k] = {
                get: get_primitive,
                set: set_primitive,
                enumerable: true,
                configurable: true,
            };
        }
    });
    return propertiesMap;
}
//# sourceMappingURL=__reactivePropertyDescriptors.js.map