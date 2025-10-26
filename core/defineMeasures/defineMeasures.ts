export default function defineMeasures<T extends string, K extends string>(
    name: T,
    measures: [K, number][]
): void {
    const defaultMeasure = measures.find(measure => measure[1] === 1)

    if (defaultMeasure == null) {
        throw new Error(`${name}: default measure (1) not defined`)
    }

    const defaultMeasureName = defaultMeasure[0].toLowerCase()

    const properties: Record<string, PropertyDescriptor> = {}
    measures.forEach(measure => {
        properties[measure[0].toLowerCase()] = {
            get(this: number): Number {
                if (this.measure != null && this.measure != defaultMeasureName) {
                    throw new Error(`measures mismatch: ${this.measure}, ${name}`)
                }

                const newNumber = new Number(this * measure[1])
                newNumber.measure = defaultMeasureName
                return newNumber
            },
        }
        properties['in' + measure[0]] = {
            get(this: number): Number {
                if (this.measure != null && this.measure != defaultMeasureName) {
                    throw new Error(`measures mismatch: ${this.measure}, ${name}`)
                }

                const newNumber = new Number(this / measure[1])
                newNumber.measure = defaultMeasureName
                return newNumber
            },
        }
    })
    Object.defineProperties(Number.prototype, properties)
}
