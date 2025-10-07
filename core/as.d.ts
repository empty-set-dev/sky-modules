export {};
declare global {
    const as: typeof lib.as & (new () => void);
}
declare namespace lib {
    function as<T>(value: unknown): asserts value is T;
}
//# sourceMappingURL=as.d.ts.map