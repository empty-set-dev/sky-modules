import globalify from '@sky-modules/core/globalify'

import UniversalCanvasAppLauncher, * as imports from '../UniversalCanvasAppLauncher'

declare global {
    const UniversalCanvasAppLauncher: typeof imports.default
    type UniversalCanvasAppLauncher = typeof imports.default
}

globalify({ UniversalCanvasAppLauncher })
