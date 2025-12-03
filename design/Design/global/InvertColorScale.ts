import globalify from '@sky-modules/core/globalify'

import * as imports from '../InvertColorScale'

declare global {
    type InvertColorScale = imports.default
    type DeepInvertColorScale<T extends object> = imports.DeepInvertColorScale<T>
}

// No runtime values to globalize
