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
            new (
                executor: (resolve: () => void, reject: (reason?: unknown) => void) => void
            ): Promise.Void
        }
        number: {
            new (
                executor: (
                    resolve: (value: number) => void,
                    reject: (reason?: unknown) => void
                ) => void
            ): Promise<number>
        }
        Number: {
            new (
                executor: (
                    resolve: (value: Number) => void,
                    reject: (reason?: unknown) => void
                ) => void
            ): Promise.Number
        }
        string: {
            new (
                executor: (
                    resolve: (value: string) => void,
                    reject: (reason?: unknown) => void
                ) => void
            ): Promise<string>
        }
        String: {
            new (
                executor: (
                    resolve: (value: String) => void,
                    reject: (reason?: unknown) => void
                ) => void
            ): Promise.String
        }
        Record: {
            new <K extends string | number | symbol, V>(
                executor: (
                    resolve: (value: Record<K, V>) => void,
                    reject: (reason?: unknown) => void
                ) => void
            ): Promise.Record<K, V>
        }
        Array: {
            new <T>(
                executor: (
                    resolve: (value: Array<T>) => void,
                    reject: (reason?: unknown) => void
                ) => void
            ): Promise.Array<T>
        }
        Function: {
            String: {
                new (
                    executor: (
                        resolve: (value: Function) => void,
                        reject: (reason?: unknown) => void
                    ) => void
                ): Promise.Function
            }
        }
        object: {
            String: {
                new (
                    executor: (
                        resolve: (value: object) => void,
                        reject: (reason?: unknown) => void
                    ) => void
                ): Promise<object>
            }
        }
        Object: {
            String: {
                new (
                    executor: (
                        resolve: (value: Object) => void,
                        reject: (reason?: unknown) => void
                    ) => void
                ): Promise.Object
            }
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
