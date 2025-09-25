import globalify from 'sky/core/globalify'

import * as lib from '.'

globalify(lib)

declare global {
    type Hexagon<T = void> = lib.Hexagon<T>
    const Hexagon: typeof lib.Hexagon
    type HexagonCoordinates = lib.HexagonCoordinates
    interface HexagonCircleParameters extends lib.HexagonCircleParameters {}
    class HexagonCircle<T = void> extends lib.HexagonCircle<T> {}
    interface HexagonGridParameters<T = void> extends lib.HexagonGridParameters<T> {}
    class HexagonGrid<T = void> extends lib.HexagonGrid<T> {}
}
