export {}

declare global {
    namespace Promise {
        export interface Void extends Promise<void> {}
        export interface Number extends Promise<Number> {}
        export interface String extends Promise<String> {}
        export interface Record<K, V> extends Promise<Record<K, V>> {}
        export interface Array<T> extends Promise<Array<T>> {}
        export interface Function extends Promise<Function> {}
        export interface Object extends Promise<object> {}
    }

    interface PromiseConstructor {
        Void: typeof module.Void
        number: typeof module.number
        Number: typeof module.Number
        string: typeof module.string
        String: typeof module.String
        Record: typeof module.Record
        Array: typeof module.Array
        Function: typeof module.Function
        object: typeof module.object
        Object: typeof module.Object
    }
}

namespace module {
    export class Void extends Promise<void> {}
    export const number = Promise<number>
    export class Number extends Promise<Number> {}
    export const string = Promise<string>
    export class String extends Promise<String> {}
    export class Record<K, V> extends Promise<Record<K, V>> {}
    export class Array<T> extends Promise<Array<T>> {}
    export class Function<A extends unknown[] = [], R = void, This = never> extends Promise<
        (this: This, ...args: A) => R
    > {}
    export const object = Promise<object>
    export class Object extends Promise<object> {}
}

Object.assign(Promise, module)
