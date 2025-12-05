import globalify from '@sky-modules/core/globalify'

import GridItem, * as imports from '../Grid.Item.lite'

declare global {
    const GridItem: typeof imports.default
    type GridItem = typeof imports.default
    type GridItemProps<T extends BoxAs = 'div'> = imports.GridItemProps<T>
}

globalify({ GridItem })
