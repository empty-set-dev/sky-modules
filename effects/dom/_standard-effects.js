import globalify from '@sky-modules/core/globalify';
function default__getEffect(main) {
    return main.effect;
}
async function property(main, target, key, deps, parameters) {
    var _a;
    const getEffect = (_a = parameters === null || parameters === void 0 ? void 0 : parameters.getEffect) !== null && _a !== void 0 ? _a : default__getEffect;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (target[key]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effect = getEffect(target[key]);
        if (effect && !effect.isDestroyed) {
            await effect.destroy();
        }
    }
    return new Effect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;
        target[key] = main;
        return async () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const effect = getEffect(target[key]);
            if (!effect.isDestroyed) {
                await effect.destroy();
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete target[key];
        };
    }, deps);
}
function inArray(source, target, deps) {
    return new Effect(() => {
        target.push(source);
        return () => {
            target.remove(source);
        };
    }, deps);
}
class Interval {
    constructor(callback, interval, deps, ...args) {
        this.effect = new Effect(deps, this);
        const identifier = setInterval(async () => {
            await callback(...args);
        }, interval.valueOf() * 1000);
        this.effect.destroy = () => {
            clearInterval(identifier);
        };
    }
}
class AnimationFrame {
    constructor(callback, deps, ...args) {
        this.effect = new Effect(deps, this);
        const identifier = requestAnimationFrame(async () => await callback(...args));
        this.effect.destroy = () => {
            cancelAnimationFrame(identifier);
        };
    }
}
class AnimationFrames {
    constructor(callback, deps, ...args) {
        this.effect = new Effect(deps, this);
        let identifier;
        const frame = async () => {
            await callback(...args);
            identifier = requestAnimationFrame(frame);
        };
        identifier = requestAnimationFrame(frame);
        this.effect.destroy = () => {
            cancelAnimationFrame(identifier);
        };
    }
}
class WindowEventListener {
    constructor(type, listener, deps, options) {
        this.effect = new Effect(deps, this);
        const handle = (...args) => {
            ;
            listener.call(window, ...args);
        };
        window.addEventListener(type, handle, options);
        this.effect.destroy = () => {
            window.removeEventListener(type, handle, options);
        };
    }
}
class DocumentEventListener {
    constructor(type, listener, deps, options) {
        this.effect = new Effect(deps, this);
        const handle = (...args) => {
            ;
            listener.call(window, ...args);
        };
        document.addEventListener(type, handle, options);
        this.effect.destroy = () => {
            document.removeEventListener(type, handle, options);
        };
    }
}
class PointerLock {
    constructor(deps) {
        this.effect = new Effect(deps, this);
        this.locking = document.body.requestPointerLock();
        this.effect.destroy = () => {
            document.exitPointerLock();
        };
    }
    async foo() {
        //
    }
}
class Fullscreen {
    constructor(deps) {
        this.effect = new Effect(deps, this);
        this.requesting = document.body.requestFullscreen();
        this.effect.destroy = async () => {
            //TODO: test
            await document.exitFullscreen();
        };
    }
}
globalify({
    property,
    inArray,
    Timeout,
    Interval,
    AnimationFrame,
    AnimationFrames,
    WindowEventListener,
    DocumentEventListener,
    PointerLock,
    Fullscreen,
});
//# sourceMappingURL=_standard-effects.js.map