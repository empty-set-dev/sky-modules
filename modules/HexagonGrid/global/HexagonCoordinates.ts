import globalify from '@sky-modules/core/globalify'

import * as imports from '../HexagonCoordinates'

declare global {
    type HexagonCoordinates = imports.default
}

// No runtime values to globalize
