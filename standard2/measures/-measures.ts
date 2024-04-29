import globalify from 'helpers/globalify'

declare global {
    interface measures {}
    const measures: typeof module.measures & measures
}

const MEASURE = Symbol('Measure')

namespace module {
    export const measures = <M>(
        name: string,
        measures: [string, number][]
    ): Record<Object.Index, unknown> => {
        const result: Record<Object.Index, unknown> = {
            [name]: (value: number, dimension?: number): M =>
                (dimension != null ? value * dimension : value) as never,
        }

        const properties = {}

        let base = 1
        measures.forEach(measure => {
            const [name, value] = measure
            base *= value
            result[name] = base

            const prototype = Object.assign(Object.create(Number), {
                [MEASURE]: value,
            })

            properties[name] = {
                get(): M {
                    const result = ((this.valueOf() * (this[MEASURE] ?? 1)) /
                        value) as never as time
                    Object.setPrototypeOf(result, prototype)
                    return result as never
                },
            }
        })

        Object.defineProperties(Number.prototype, properties)

        return result
    }
}

globalify(module)
