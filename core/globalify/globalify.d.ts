declare function globalify(module: Record<PropertyKey, unknown>): void;
declare namespace globalify {
    var namespace: (ns: string, module: Record<PropertyKey, unknown>) => void;
}
export default globalify;
//# sourceMappingURL=globalify.d.ts.map