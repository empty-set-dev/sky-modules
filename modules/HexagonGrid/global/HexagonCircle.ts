import globalify from '@sky-modules/core/globalify'

import HexagonCircle from '../HexagonCircle'

declare global {
    const HexagonCircle: typeof HexagonCircle
    type HexagonCircle = typeof HexagonCircle
}

globalify({ HexagonCircle })
