import globalify from '@sky-modules/core/globalify'

import Hexagon, * as imports from '../Hexagon'

declare global {
    const Hexagon: typeof imports.default
    type Hexagon = typeof imports.default
}

globalify({ Hexagon })
