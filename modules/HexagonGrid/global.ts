import globalify from 'sky/utilities/globalify'

import * as pkg from '.'

globalify(pkg)

declare global {
    type Hexagon = pkg.Hexagon
    const Hexagon: typeof pkg.Hexagon
    class HexagonGrid extends pkg.HexagonGrid {}
    interface CircleParameters extends pkg.HexagonCircleParameters {}
    class HexagonCircle extends pkg.HexagonCircle {}
}
