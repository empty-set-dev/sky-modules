import globalify from 'sky/utilities/globalify'

import pkg from '.'

globalify({ Hexagon: pkg })

declare global {
    namespace Hexagon {
        type Grid = pkg.Grid
        const Grid: typeof pkg.Grid
        type CircleParameters = pkg.CircleParameters
        type Circle = pkg.Circle
        const Circle: typeof pkg.Circle
    }
}
