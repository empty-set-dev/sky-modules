export {};
declare global {
    type read = typeof lib.read;
    const read: typeof lib.read;
    type write = typeof lib.write;
    const write: typeof lib.write;
    type secret = typeof lib.secret;
    const secret: typeof lib.secret;
    const boolean: typeof lib.boolean & {
        new (): void;
    };
    const number: typeof lib.number & {
        new (): void;
    };
    const string: typeof lib.string & {
        new (): void;
    };
    const object: typeof lib.object & {
        new (): void;
    };
    type array = typeof lib.array;
    const array: typeof lib.array;
    type func<T extends Function> = lib.func<T>;
    const func: typeof lib.func;
    type optional = typeof lib.optional;
    const optional: (<T>(value: T) => undefined | T) & {
        boolean: undefined | typeof boolean;
        number: undefined | typeof number;
        string: undefined | typeof string;
        func: undefined | typeof func;
    };
    type nullable = typeof lib.nullable;
    const nullable: (<T>(value: T) => null | T) & {
        boolean: null | typeof boolean;
        number: null | typeof number;
        string: null | typeof string;
        func: null | typeof func;
    };
    type nullish = typeof lib.nullable;
    const nullish: (<T>(value: T) => undefined | null | T) & {
        boolean: undefined | null | typeof boolean;
        number: undefined | null | typeof number;
        string: undefined | null | typeof string;
        func: undefined | null | typeof func;
    };
}
declare namespace lib {
    function read<T>(schema: T): T;
    function write<T>(schema: T): T;
    function secret<T>(schema: T): T;
    function boolean(target: Object, key: string): void;
    namespace boolean {
        var type: boolean;
    }
    function number(target: Object, key: string): void;
    namespace number {
        var type: number;
    }
    function string(target: Object, key: string): void;
    namespace string {
        var type: string;
    }
    function object<T extends Class | object>(schema: T): (target: Object, key: string) => void;
    function array<T>(type: T): (target: Object, key: string) => void;
    type func<T extends Function> = {
        type: T;
    };
    function func<T extends Function = () => void>(target: Object, key: string): void & func<T>;
    function optional<T>(schema: T): undefined | T;
    namespace optional {
        var boolean: typeof lib.boolean | undefined;
        var number: typeof lib.number | undefined;
        var string: typeof lib.string | undefined;
        var func: typeof lib.func | undefined;
    }
    function nullable<T>(schema: T): null | T;
    namespace nullable {
        var boolean: typeof lib.boolean | null;
        var number: typeof lib.number | null;
        var string: typeof lib.string | null;
        var func: typeof lib.func | null;
    }
    function nullish<T>(schema: T): undefined | null | T;
    namespace nullish {
        var boolean: typeof lib.boolean | null | undefined;
        var number: typeof lib.number | null | undefined;
        var string: typeof lib.string | null | undefined;
        var func: typeof lib.func | null | undefined;
    }
}
//# sourceMappingURL=_types.d.ts.map