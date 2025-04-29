import globalify from 'sky/utilities/globalify'

import pkg from '.'

globalify({ Hexagon: pkg })

declare global {
    namespace Hexagon {
        class Grid extends pkg.Grid {}
        interface CircleParameters extends pkg.CircleParameters {}
        class Circle extends pkg.Circle {}
    }
}
