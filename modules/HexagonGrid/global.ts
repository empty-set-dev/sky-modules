import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify(module)

declare global {
    type Hexagon = module.Hexagon
    const Hexagon: typeof module.Hexagon
    type HexagonCoordinates = module.HexagonCoordinates
    interface HexagonCircleParameters extends module.HexagonCircleParameters {}
    class HexagonCircle extends module.HexagonCircle {}
    class HexagonGrid extends module.HexagonGrid {}
}
