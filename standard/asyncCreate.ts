import globalify from 'sky/utilities/globalify'

declare global {
    interface SymbolConstructor {
        /**
         * A promise that is resolves into instance
         */
        readonly asyncCreate: unique symbol
    }

    type WhenResult<T> = lib.WhenResult<T>
    const when: typeof lib.when
}

namespace lib {
    Object.defineProperty(Symbol, 'asyncCreate', {
        value: Symbol('asyncCreate'),
    })

    export type WhenResult<T> =
        T extends Promise<T> ? T : T extends new (...args: infer A) => infer I ? I : T

    export function when<T extends object | object[], A extends unknown[]>(
        object: T,
        callback?: (result: WhenResult<T>, ...args: A) => void | Promise<void>,
        ...args: A
    ): ReturnType<typeof async<void, [], WhenResult<T>>> {
        return async(async () => {
            if (Array.isArray(object)) {
                const result = (await Promise.all(
                    object.map(value => async (): Promise<object> => {
                        let result: object

                        if (value[Symbol.asyncCreate] != null) {
                            result = await value[Symbol.asyncCreate]
                        } else {
                            const promise = value
                            result = (await promise) as object
                        }

                        return result
                    })
                )) as WhenResult<T>

                callback && (await callback(result, ...args))
                return result
            }

            extends_type<{ [Symbol.asyncCreate]: Promise<WhenResult<T>> } & Promise<WhenResult<T>>>(
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
