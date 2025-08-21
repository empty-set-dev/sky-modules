import globalify from 'sky/utilities/globalify'

declare global {
    function measures<T extends string, K extends string>(
        name: T,
        measures: [K, number][]
    ): {
        [x: string]: ((value: number, dimension?: number) => number) | number
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

        measures.forEach(measure => {
            const [name, base] = measure
            result[name] = base

            const currentBase = base
            properties[name] = {
                get(): number {
                    return (this as number) / currentBase
                },
            }
        })

        if (
            measures[0] &&
            Number.prototype[measures[0][0] as keyof typeof Number.prototype] == null
        ) {
            Object.defineProperties(Number.prototype, properties as never)
        }

        return result
    }
}

globalify(lib)
