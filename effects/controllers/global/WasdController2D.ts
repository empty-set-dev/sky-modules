import globalify from '@sky-modules/core/globalify'

import WasdController2D, * as imports from '../WasdController2D'

declare global {
    const WasdController2D: typeof imports.default
    type WasdController2D = typeof imports.default
    type WasdController2DParameters = imports.WasdController2DParameters
}

globalify({ WasdController2D })
