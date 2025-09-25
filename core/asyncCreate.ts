import globalify from 'sky/standard/globalify'

declare global {
    interface SymbolConstructor {
        /**
         * A promise that is resolves into instance
         */
        readonly asyncConstructor: unique symbol
    }

    type WhenResult<T> = lib.WhenResult<T>
    const when: typeof lib.when
}

namespace lib {
    Object.defineProperty(Symbol, 'asyncConstructor', {
        value: Symbol('asyncConstructor'),
    })

    export type WhenResult<T> =
        T extends Promise<T> ? T : T extends new (...args: infer A) => infer I ? I : T

    export function when<T extends object | object[], A extends unknown[]>(
        object: T,
        callback?: (result: WhenResult<T>, ...args: A) => void | Promise<void>,
        ...args: A
    ): ReturnType<typeof task<void, [], WhenResult<T>>> {
        return task(async () => {
            if (Array.isArray(object)) {
                const result = (await Promise.all(
                    object.map(value =>
                        continuous(async () => {
                            let result: object

                            if (value[Symbol.asyncConstructor] != null) {
                                result = await value[Symbol.asyncConstructor]
                            } else {
                                const promise = value
                                result = (await promise) as object
                            }

                            return result
                        })
                    )
                )) as WhenResult<T>
                callback && (await callback(result, ...args))
                return result
            }

            as<{ [Symbol.asyncCreate]: Promise<WhenResult<T>> } & Promise<WhenResult<T>>>(
                object
            )

            let result: WhenResult<T>

            if (object[Symbol.asyncCreate] != null) {
                result = await object[Symbol.asyncCreate]
            } else {
                const promise = object
                result = (await promise) as WhenResult<T>
            }

            callback && (await callback(result, ...args))
            return result
        })
    }
}

globalify(lib)
