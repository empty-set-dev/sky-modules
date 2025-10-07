export {};
declare global {
    type resolve<T> = (result: T) => T;
    interface PromiseConstructor {
        'new'<T = void>(): [promise: Promise<T>, resolve: resolve<T>];
    }
}
//# sourceMappingURL=_Promise-new.d.ts.map