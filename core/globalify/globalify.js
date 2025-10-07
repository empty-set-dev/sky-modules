import mergeNamespace from '@sky-modules/core/mergeNamespace';
function canBecameScope(scope) {
    return (scope !== null &&
        (typeof scope === 'undefined' || typeof scope === 'object' || typeof scope === 'function'));
}
function globalify(module) {
    mergeNamespace(global, module);
}
define('sky.core.globalify', globalify);
export default globalify;
define('sky.core.globalify.namespace', globalify.namespace);
globalify.namespace = function namespace(ns, module) {
    var _a;
    const parts = ns.split('.');
    let scope = global;
    for (let i = 0; i < parts.length; i++) {
        const key = parts[i];
        if (!canBecameScope(scope[key])) {
            throw Error('globalify.namespace: not a scope');
        }
        (_a = scope[key]) !== null && _a !== void 0 ? _a : (scope[key] = {});
        scope = scope[key];
        if (i === parts.length - 1) {
            mergeNamespace(scope, module);
        }
    }
};
//# sourceMappingURL=globalify.js.map