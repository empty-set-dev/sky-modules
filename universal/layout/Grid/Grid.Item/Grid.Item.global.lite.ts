import globalify from '@sky-modules/core/globalify'

import Grid_Item_lite, * as imports from './Grid.Item.lite'

declare global {
    const Grid_Item_lite: typeof imports.default
    type Grid_Item_lite = typeof imports.default
    type GridItemProps = imports.GridItemProps
}

globalify({ Grid_Item_lite, ...imports })
