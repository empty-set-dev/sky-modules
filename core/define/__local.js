import __array from './__array';
import __makePlain from './__makePlain';
import { observe as __observe, unobserve as __unobserve } from './__observe';
import __reactivePropertyDescriptors from './__reactivePropertyDescriptors';
var local;
(function (local) {
    local.array = __array;
    local.makePlain = __makePlain;
    local.observe = __observe;
    local.unobserve = __unobserve;
    local.reactivePropertyDescriptors = __reactivePropertyDescriptors;
    local.constructorSymbol = Symbol('constructor');
    local.idSymbol = Symbol('id');
    local.typeSymbol = Symbol('type');
    local.nameSymbol = Symbol('name');
    local.uidSymbol = Symbol('uid');
    local.listenersOfReactivitySymbol = Symbol('listenersOfReactivity');
    local.listenersOfShared = Symbol('listenersOfShared');
    local.uniqueId = 2;
    local.loadedDefines = {};
    local.defines = {};
    local.schemas = {};
    local.reactions = [];
    local.currentDefinesSymbol = Symbol('sky.standard.define.#currentDefines');
    local.isHot = isRuntime && Object.keys(local.defines).length === 0;
})(local || (local = {}));
export default local;
//# sourceMappingURL=__local.js.map