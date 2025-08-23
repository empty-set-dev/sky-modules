import globalify from 'sky/utilities/globalify'

declare global {
    function defineMeasures<T extends string, K extends string>(
        name: T,
        measures: [K, number][]
    ): void
}

namespace lib {
    export function defineMeasures<T extends string, K extends string>(
        name: T,
        measures: [K, number][]
    ): void {
        const properties: Record<string, PropertyDescriptor> = {}
        measures.forEach(measure => {
            properties['as' + measure[0]] = {
                get(this: number): Number {
                    if (this.measure != null && this.measure != name) {
                        throw Error(`measures mismatch: ${this.measure}, ${name}`)
                    }

                    const newNumber = new Number(this * measure[1])
                    newNumber.measure = name
                    return newNumber
                },
            }
            properties['in' + measure[0]] = {
                get(this: number): Number {
                    if (this.measure != null && this.measure != name) {
                        throw Error(`measures mismatch: ${this.measure}, ${name}`)
                    }

                    const newNumber = new Number(this / measure[1])
                    newNumber.measure = name
                    return newNumber
                },
            }
        })
        Object.defineProperties(Number.prototype, properties)
    }
}

globalify(lib)
