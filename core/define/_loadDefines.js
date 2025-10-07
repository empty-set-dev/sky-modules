import local from './__local';
import './_define';
var lib;
(function (lib) {
    define('sky.core.loadDefines', loadDefines);
    async function loadDefines(defines) {
        Object.keys(defines).forEach(k => {
            local.loadedDefines[k] = defines[k];
            local.uniqueId = Math.max(local.uniqueId, defines[k]);
            local.staticMaxId = local.uniqueId;
        });
    }
    lib.loadDefines = loadDefines;
})(lib || (lib = {}));
Object.assign(global, lib);
//# sourceMappingURL=_loadDefines.js.map