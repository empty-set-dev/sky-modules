import globalify from 'sky/utilities/globalify'

declare global {
    interface SymbolConstructor {
        /**
         * A promise that is resolves into instance
         */
        readonly asyncCreate: unique symbol
    }
}

namespace lib {
    Object.defineProperty(Symbol, 'asyncCreate', {
        value: Symbol('asyncCreate'),
    })

    export function when<T, A extends unknown[]>(
        object: Object | Promise<T>,
        callback: (result: T, ...args: A) => void,
        ...args: A
    ): void {
        extends_type<{ [Symbol.asyncCreate]: Promise<T> } & Promise<T>>(object)

        async(async () => {
            let result: T

            if (object[Symbol.asyncCreate] != null) {
                result = await object[Symbol.asyncCreate]
            } else {
                const promise = object
                result = await promise
            }

            callback(result, ...args)
        })
    }
}

globalify(lib)
