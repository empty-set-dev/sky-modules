import globalify from '@sky-modules/core/globalify'

import Grid_lite, * as imports from './Grid.lite'

declare global {
    const Grid_lite: typeof imports.default
    type Grid_lite = typeof imports.default
    type GridProps = imports.GridProps
}

globalify({ Grid_lite, ...imports })
