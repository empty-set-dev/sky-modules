import globalify from 'helpers/globalify'

declare global {
    function measures<T extends string, K extends string>(
        name: T,
        measures: [K, number][]
    ): {
        [x: string]: ((value: number, dimension?: number) => number) | number
    }
}

namespace module {
    export function measures<T extends string, K extends string>(
        name: T,
        measures: [K, number][]
    ): {
        [x: string]: ((value: number, dimension?: number) => number) | number
    } {
        const result: {
            [x: string]: ((value: number, dimension?: number) => number) | number
        } = {
            [name]: (value: number, dimension?: number): number =>
                (dimension != null ? value * dimension : value) as never,
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
                    return this / currentBase
                },
            }
        })

        Object.defineProperties(Number.prototype, properties)

        return result
    }
}

globalify(module)
