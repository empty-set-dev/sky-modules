import globalify from '@sky-modules/core/globalify'

import HexagonsPanel, * as imports from '../HexagonsPanel'

declare global {
    const HexagonsPanel: typeof imports.default
    type HexagonsPanel = typeof imports.default
}

globalify({ HexagonsPanel })
