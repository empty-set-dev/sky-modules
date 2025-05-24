import globalify from 'sky/utilities/globalify'

import * as module from '.'

globalify(module)

declare global {
    type Hexagon = module.Hexagon
    const Hexagon: typeof module.Hexagon
    class HexagonGrid extends module.HexagonGrid {}
    interface HexagonCircleParameters extends module.HexagonCircleParameters {}
    class HexagonCircle extends module.HexagonCircle {}
}
