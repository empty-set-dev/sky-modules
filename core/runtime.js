import '@sky-modules/core/Promise/global';
var local;
(function (local) {
    var _a;
    _a = Promise.new(), local.runtime = _a[0], local.resolveRuntime = _a[1];
    local.isHot = typeof isRuntime === 'boolean';
})(local || (local = {}));
var lib;
(function (lib) {
    lib.runtime = local.runtime;
})(lib || (lib = {}));
init();
function init() {
    if (local.isHot) {
        return;
    }
    Object.defineProperty(global, 'isRuntime', {
        get() {
            return false;
        },
        set() {
            Object.defineProperty(global, 'isRuntime', {
                configurable: false,
                enumerable: true,
                get() {
                    return true;
                },
                set() {
                    //
                },
            });
            local.resolveRuntime();
        },
        configurable: true,
        enumerable: true,
    });
}
Object.assign(global, lib);
//# sourceMappingURL=runtime.js.map