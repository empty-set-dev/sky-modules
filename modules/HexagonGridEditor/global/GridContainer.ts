import globalify from '@sky-modules/core/globalify'

import GridContainer, * as imports from '../GridContainer'

declare global {
    const GridContainer: typeof imports.default
    type GridContainer = typeof imports.default
    type GridContainerParameters = imports.GridContainerParameters
}

globalify({ GridContainer })
