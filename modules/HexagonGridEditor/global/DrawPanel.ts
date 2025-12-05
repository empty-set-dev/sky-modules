import globalify from '@sky-modules/core/globalify'

import DrawPanel, * as imports from '../DrawPanel'

declare global {
    const DrawPanel: typeof imports.default
    type DrawPanel = typeof imports.default
    type DrawPanelParameters = imports.DrawPanelParameters
}

globalify({ DrawPanel })
