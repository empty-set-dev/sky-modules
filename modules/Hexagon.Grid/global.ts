import globalify from 'sky/utilities/globalify'

import pkg from '.'

globalify({ Hexagon: pkg })

declare global {
    namespace Hexagon {
        type Hexagon = pkg.Hexagon
        const Hexagon: typeof pkg.Hexagon
        class Grid extends pkg.Grid {}
        interface CircleParameters extends pkg.CircleParameters {}
        class Circle extends pkg.Circle {}
    }
}
