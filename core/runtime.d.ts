import '@sky-modules/core/Promise/global';
declare global {
    let isRuntime: boolean;
    type runtime = typeof runtime;
    const runtime: typeof lib.runtime;
}
declare namespace lib {
    const runtime: Promise<void>;
}
export {};
//# sourceMappingURL=runtime.d.ts.map