export {}

type PromiseVoid = Promise<void>
type PromiseString = Promise<String>
type PromiseNumber = Promise<Number>
type PromiseRecord<K extends string | number | symbol, V> = Promise<Record<K, V>>
type PromiseArray<T> = Promise<Array<T>>
type PromiseFunction = Promise<Function>
type PromiseObject = Promise<Object>

declare global {
    namespace Promise {
        export interface Void extends PromiseVoid {}
        export interface Number extends PromiseNumber {}
        export interface String extends PromiseString {}
        export interface Record<K extends string | number | symbol, V>
            extends PromiseRecord<K, V> {}
        export interface Array<T> extends PromiseArray<T> {}
        export interface Function extends PromiseFunction {}
        export interface Object extends PromiseObject {}
    }

    interface PromiseConstructor {
        Void: {
            new (...args: ConstructorParameters<PromiseConstructor>): Promise.Void
        }
        number: {
            new (...args: ConstructorParameters<PromiseConstructor>): Promise<number>
        }
        Number: {
            new (...args: ConstructorParameters<PromiseConstructor>): Promise.Number
        }
        string: {
            new (...args: ConstructorParameters<PromiseConstructor>): Promise<string>
        }
        String: {
            new (...args: ConstructorParameters<PromiseConstructor>): Promise.String
        }
        Record: {
            new <K extends string | number | symbol, V>(
                ...args: ConstructorParameters<PromiseConstructor>
            ): Promise.Record<K, V>
        }
        Array: {
            new <T>(...args: ConstructorParameters<PromiseConstructor>): Promise.Array<T>
        }
        Function: {
            new (...args: ConstructorParameters<PromiseConstructor>): Promise.Function
        }
        object: {
            new (...args: ConstructorParameters<PromiseConstructor>): Promise<object>
        }
        Object: {
            new (...args: ConstructorParameters<PromiseConstructor>): Promise.Object
        }
    }
}

namespace module {
    export const Void = Promise
    export const number = Promise
    export const Number = Promise
    export const string = Promise
    export const String = Promise
    export const Record = Promise
    export const Array = Promise
    export const Function = Promise
    export const object = Promise
    export const Object = Promise
}

Object.assign(Promise, module)
