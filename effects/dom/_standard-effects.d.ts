declare global {
    function property<T>(main: unknown, target: T, key: keyof T, deps: EffectDeps, parameters?: PropertyParameters): Promise<Effect>;
    function inArrayEffect<T>(source: T, target: T[], deps: EffectDeps): Effect;
    class Timeout<T = void, A extends unknown[] = []> {
        readonly effect: Effect;
        constructor(callback: (...args: A) => T, timeout: Time, deps: EffectDeps, ...args: A[]);
    }
    class Interval<T = void, A extends unknown[] = []> {
        readonly effect: Effect;
        constructor(callback: (...args: A) => T, interval: Time, deps: EffectDeps, ...args: A);
    }
    class AnimationFrame<T = void, A extends unknown[] = []> {
        readonly effect: Effect;
        constructor(callback: (...args: A) => T, deps: EffectDeps, ...args: A);
    }
    class AnimationFrames<T = void, A extends unknown[] = []> {
        readonly effect: Effect;
        constructor(callback: (...args: A) => T, deps: EffectDeps, ...args: A);
    }
    class WindowEventListener<K extends keyof WindowEventMap, T> {
        readonly effect: Effect;
        constructor(type: K, listener: (this: Window, ev: WindowEventMap[K]) => T, deps: EffectDeps, options?: boolean | AddEventListenerOptions);
    }
    class DocumentEventListener<K extends keyof DocumentEventMap, T> {
        readonly effect: Effect;
        constructor(type: K, listener: (this: Window, ev: DocumentEventMap[K]) => T, deps: EffectDeps, options?: boolean | AddEventListenerOptions);
    }
    class PointerLock {
        readonly effect: Effect;
        constructor(deps: EffectDeps);
    }
    class Fullscreen {
        readonly effect: Effect;
        constructor(deps: EffectDeps);
    }
}
interface PropertyParameters {
    getEffect(main: unknown): Effect;
}
export {};
//# sourceMappingURL=_standard-effects.d.ts.map