export {}

declare global {
    namespace Promise {
        export type Void = Promise<void>
        export type Number = Promise<Number>
        export type String = Promise<String>
        export type Record<K, V> = Promise<Record<K, V>>
        export type Array<T> = Promise<Array<T>>
        export type Function = Promise<Function>
        export type Object = Promise<object>
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
    //@ts-ignore
    export class Object extends Promise<object> {}
}

Object.assign(Promise, module)
