import 'sky/features/effect/global'

import './honeycom-grid.d'

import HexagonHexagon from './_Hexagon'
import HexagonCircle, { HexagonCircleParameters } from './_HexagonCircle'
import HexagonGrid from './_HexagonGrid'

const Hexagon = { Hexagon: HexagonHexagon, Grid: HexagonGrid, Circle: HexagonCircle }
namespace Hexagon {
    export type Hexagon = HexagonHexagon
    export type Grid = HexagonGrid
    export type Circle = HexagonCircle
    export type CircleParameters = HexagonCircleParameters
}

export default Hexagon
