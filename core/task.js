import { runsOnClientSide } from '@sky-modules/platform/runsOnSide';
var lib;
(function (lib) {
    // [ ] return Promise with overrided then, catch, finally methods for better stack traces
    define('sky.core.async', task);
    async function task(...args) {
        let object;
        let callback;
        let args_;
        if (typeof args[0] !== 'function') {
            object = args[0];
            callback = args[1];
            args_ = args.slice(2);
        }
        else {
            callback = args[0];
            args_ = args.slice(1);
        }
        try {
            if (object != null) {
                return (await callback.call(object, ...args_));
            }
            else {
                return (await callback(...args_));
            }
        }
        catch (error) {
            const maybePromise = onAsyncError(error);
            if (maybePromise != null) {
                await maybePromise;
            }
        }
    }
    lib.task = task;
    async function continuous(...args) {
        let object;
        let callback;
        let args_;
        if (typeof args[0] !== 'function') {
            object = args[0];
            callback = args[1];
            args_ = args.slice(2);
        }
        else {
            callback = args[0];
            args_ = args.slice(1);
        }
        if (object != null) {
            return task(object, callback, ...args_);
        }
        else {
            return task(callback, ...args_);
        }
    }
    lib.continuous = continuous;
    function default_onAsyncError(error) {
        if (runsOnClientSide) {
            setTimeout(() => {
                throw error;
            });
        }
        else {
            throw error;
        }
    }
    lib.default_onAsyncError = default_onAsyncError;
})(lib || (lib = {}));
Object.assign(global, lib);
Object.assign(global, { onAsyncError: lib.default_onAsyncError });
//# sourceMappingURL=task.js.map