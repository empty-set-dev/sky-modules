import './_measures'
import globalify from 'sky/utilities/globalify'

declare global {
    const nanogram: number
    const milligram: number
    const decigram: number
    const gram: number
    const kilogram: number
    const ton: number

    interface Weight extends Number, WeightID {
        get nanogram(): number
        get milligram(): number
        get decigram(): number
        get gram(): number
        get kilogram(): number
        get ton(): number
    }
    function Weight(value: Weight | number, dimension?: number): Weight
}

class WeightID {
    private WeightID!: void
}

globalify(
    measures('Weight', [
        ['nanogram', 0.000000001],
        ['milligram', 0.001],
        ['decigram', 0.1],
        ['gram', 1],
        ['kilogram', 1000],
        ['ton', 1000000],
    ])
)
