import 'sky/features/effect/global'

import HexagonCircle, { HexagonCircleParameters } from './_HexagonCircle'
import HexagonGrid from './_HexagonGrid'
const Hexagon = { Grid: HexagonGrid, Circle: HexagonCircle }
namespace Hexagon {
    export type Grid = HexagonGrid
    export type Circle = HexagonCircle
    export type CircleParameters = HexagonCircleParameters
}

export default Hexagon
