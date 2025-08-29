import './asyncCreate'

import globalify from 'sky/utilities/globalify'

declare global {
    const CircularSingletonDependencyError: typeof lib.CircularSingletonDependencyError
    const singleton: typeof lib.singleton
    const inject: typeof lib.inject
    const weak_inject: typeof lib.weak_inject
    const getSingleton: typeof lib.getSingleton
}

namespace local {
    export const singletonSymbol = Symbol('singleton')
    export const singletonOnErrorSymbol = Symbol('singletonOnError')
    export const singletonCreatePromiseSymbol = Symbol('singletonCreatePromise')
    export const promiseResolveSymbol = Symbol('promiseResolve')
    export const promiseSingletonSymbol = Symbol('promiseSingleton')
    export const injectsSymbol = Symbol('injects')

    export interface SingletonInstance {
        start?: (this: object) => void | Promise<void>
    }
    export type Singleton = Class<new () => SingletonInstance> & {
        [singletonSymbol]: true | SingletonInstance
        [singletonOnErrorSymbol]?: Error
        [singletonCreatePromiseSymbol]: SingletonCreatePromise
        [injectsSymbol]: SingletonCreatePromise[]
        [Symbol.asyncCreate]: Promise<SingletonInstance>
    }
    export type SingletonCreatePromise = Promise<SingletonInstance> & {
        [promiseResolveSymbol]: (singletonInstance: SingletonInstance) => void
        [promiseSingletonSymbol]: Singleton
    }

    export function isSingleton<T extends Class>(singleton: T): singleton is T & Singleton {
        extends_type<local.Singleton>(singleton)

        return singleton[singletonSymbol] != null || singleton[singletonCreatePromiseSymbol] != null
    }

    export const singletons: Singleton[] = []

    export async function createSingleton(singleton: Singleton): Promise<void> {
        if (singleton[singletonSymbol] === true) {
            throw new CircularSingletonDependencyError(singleton)
        }

        singleton[singletonSymbol] = true
        const singletonInstance = new singleton()

        if (singleton[injectsSymbol] != null) {
            for (const inject of singleton[injectsSymbol]) {
                const injectedSingleton = inject[local.promiseSingletonSymbol]

                if (injectedSingleton[local.singletonSymbol] === true) {
                    throw new CircularSingletonDependencyError(singleton)
                } else if (injectedSingleton[local.singletonSymbol] != null) {
                    continue
                }

                await createSingleton(injectedSingleton)
            }
        }

        if (singletonInstance.start != null) {
            await singletonInstance.start()
        }

        singleton[local.singletonSymbol] = singletonInstance
        singleton[local.singletonCreatePromiseSymbol][local.promiseResolveSymbol](singletonInstance)
    }

    async(async () => {
        await runtime

        for (const singleton of singletons) {
            const [promise, resolve] = Promise.new<SingletonInstance>()
            extends_type<SingletonCreatePromise>(promise)
            promise[promiseResolveSymbol] = resolve
            promise[promiseSingletonSymbol] = singleton
            singleton[local.singletonCreatePromiseSymbol] = promise
            singleton[Symbol.asyncCreate] = promise
        }

        for (const singleton of singletons) {
            if (singleton[singletonSymbol] === true) {
                throw new CircularSingletonDependencyError(singleton)
            } else if (singleton[singletonSymbol] != null) {
                continue
            }

            await createSingleton(singleton)
        }

        for (const singleton of singletons) {
            delete singleton[local.singletonOnErrorSymbol]
        }
    })
}

namespace lib {
    export class CircularSingletonDependencyError extends Error {
        constructor(singleton: local.Singleton) {
            super(`circular singleton dependency error in ${singleton.name}`)

            if (singleton[local.singletonOnErrorSymbol] != null) {
                this.message += `\nCaused by: ${singleton[local.singletonOnErrorSymbol]?.stack}`
            }
        }
    }

    export function singleton<T extends Class>(target: T): T {
        extends_type<local.Singleton>(target)
        target[local.singletonOnErrorSymbol] = Error('singleton')

        local.singletons.push(target)

        Object.setPrototypeOf(singleton, target)

        function singleton(): void {
            throw Error('duplicated singleton')
        }

        return singleton as (() => void) & T
    }

    export function inject(prototype: Object, key: PropertyKey): void {
        extends_type<{ [p: PropertyKey]: local.SingletonInstance } & { constructor: Class }>(
            prototype
        )

        let injectValue: object
        let promise: null | local.SingletonCreatePromise = null
        Object.defineProperty(prototype, key, {
            get(): object {
                if (promise != null) {
                    throw new CircularSingletonDependencyError(
                        promise[local.promiseSingletonSymbol]
                    )
                }

                return injectValue
            },
            set(value: object & local.SingletonCreatePromise): void {
                if (value[local.promiseResolveSymbol] != null) {
                    promise = value

                    if (local.isSingleton(prototype.constructor)) {
                        prototype.constructor[local.injectsSymbol] ??= []
                        prototype.constructor[local.injectsSymbol].push(promise)
                    }

                    async(async () => {
                        this[key] = await notNull(promise)
                        promise = null
                    })
                }

                injectValue = value
            },
        })
    }

    export function weak_inject(target: Object, key: PropertyKey): void {
        extends_type<{ [p: PropertyKey]: local.SingletonInstance }>(target)

        let injectValue: object
        let promise: null | local.SingletonCreatePromise = null
        Object.defineProperty(target, key, {
            get(): object {
                if (promise != null) {
                    throw Error(`can't get singleton on create`)
                }

                return injectValue
            },
            set(value: object & local.SingletonCreatePromise): void {
                if (value[local.promiseResolveSymbol] != null) {
                    promise = value

                    async(async () => {
                        target[key] = await notNull(promise)
                        promise = null
                    })
                }

                injectValue = value
            },
        })
    }

    export function getSingleton<T extends Class>(singleton: T): InstanceType<T> {
        if (!isRuntime) {
            throw Error(`can't get singleton before runtime`)
        }

        if (!local.isSingleton(singleton)) {
            throw Error('not a singleton')
        }

        if (singleton[local.singletonCreatePromiseSymbol] != null) {
            return singleton[local.singletonCreatePromiseSymbol] as InstanceType<T>
        }

        if (singleton[local.singletonSymbol] !== true) {
            return notNull(singleton[local.singletonSymbol]) as InstanceType<T>
        }

        throw Error(`can't get singleton in index`)
    }
}

globalify(lib)
