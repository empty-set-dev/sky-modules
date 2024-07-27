import globalify from 'sky/helpers/globalify'

import * as lib from '.'

globalify(lib)

declare global {
    const colorify: (
        destColors: (string | number[] | undefined)[] | undefined,
        lottie: unknown
    ) => unknown
    const replaceColor: (
        sourceColor: string | number[],
        targetColor: string | number[],
        lottieObj: unknown
    ) => unknown
    const flatten: (targetColor: string | number[], lottieObj: unknown) => unknown
    const getColors: (lottieObj: unknown) => unknown
}
