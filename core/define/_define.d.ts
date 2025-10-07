declare global {
    type define = typeof lib.define;
    const define: typeof lib.define;
    const schema: typeof lib.schema & {
        new (): void;
    };
}
declare namespace lib {
    function define<T extends object | Function>(name: string, value?: T): T;
    function define(name: string): (target: Class) => void;
    function schema<T extends object>(name: string, schema?: T): T;
}
export {};
//# sourceMappingURL=_define.d.ts.map