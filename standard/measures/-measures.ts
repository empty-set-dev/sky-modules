import globalify from 'sky/helpers/globalify'

declare global {
    function measures<T extends string, K extends string>(
        name: T,
        measures: [K, number][]
    ): {
        [x: string]: ((value: number, dimension: number) => number) | number
    }
}

namespace lib {
    export function measures<T extends string, K extends string>(
        name: T,
        measures: [K, number][]
    ): {
        [x: string]: ((value: number, dimension: number) => number) | number
    } {
        const result: {
            [x: string]: ((value: number, dimension: number) => number) | number
        } = {
            [name]: (value: number, dimension: number): number => value * dimension,
        }

        const properties: Record<Object.Index, unknown> = {}

        let base = 1
        measures.forEach(measure => {
            const [name, value] = measure
            base *= value
            result[name] = base

            const currentBase = base
            properties[name] = {
                get(): number {
                    return (this as number) / currentBase
                },
            }
        })

        Object.defineProperties(Number.prototype, properties as never)

        return result
    }
}

globalify(lib)
