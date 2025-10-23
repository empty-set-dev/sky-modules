import globalify from '@sky-modules/core/globalify'

import Grid, * as imports from './Grid.lite'

declare global {
    const Grid: typeof imports.default
    type Grid = typeof imports.default
    type GridProps = imports.GridProps
}

globalify({ Grid, ...imports })
