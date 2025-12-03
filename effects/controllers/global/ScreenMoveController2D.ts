import globalify from '@sky-modules/core/globalify'

import ScreenMoveController2D, * as imports from '../ScreenMoveController2D'

declare global {
    const ScreenMoveController2D: typeof imports.default
    type ScreenMoveController2D = typeof imports.default
    type ScreenMoveController2DParameters = imports.ScreenMoveController2DParameters
}

globalify({ ScreenMoveController2D })
