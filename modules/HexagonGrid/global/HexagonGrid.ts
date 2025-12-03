import globalify from '@sky-modules/core/globalify'

import HexagonGrid, * as imports from '../HexagonGrid'

declare global {
    const HexagonGrid: typeof imports.default
    type HexagonGrid = typeof imports.default
    type HexagonGridParameters<T = void> = imports.HexagonGridParameters<T>
}

globalify({ HexagonGrid })
