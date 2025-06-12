import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify(module)

declare global {
    type Hexagon<T = void> = module.Hexagon<T>
    const Hexagon: typeof module.Hexagon
    type HexagonCoordinates = module.HexagonCoordinates
    interface HexagonCircleParameters extends module.HexagonCircleParameters {}
    class HexagonCircle<T = void> extends module.HexagonCircle<T> {}
    interface HexagonGridParameters<T = void> extends module.HexagonGridParameters<T> {}
    class HexagonGrid<T = void> extends module.HexagonGrid<T> {}
}
