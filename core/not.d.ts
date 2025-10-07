export declare class UndefinedError extends Error {
    constructor(message: string);
}
export declare function notUndefined<T>(value: undefined | T, message: string): T;
export declare function assertIsNotUndefined<T>(value: undefined | T, message: string): asserts value is T;
export declare class NullError extends Error {
    constructor(message: string);
}
export declare function notNull<T>(value: null | T, message: string): T;
export declare function assertIsNotNull<T>(value: null | T, message: string): asserts value is T;
export declare class NullishError extends Error {
    constructor(message: string);
}
export declare function notNullish<T>(value: undefined | null | T, message: string): T;
export declare function assertIsNotNullish<T>(value: undefined | null | T, message: string): T;
//# sourceMappingURL=not.d.ts.map