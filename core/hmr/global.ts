import globalify from '../globalify'

import * as imports from './hmr'

declare global {
    const isHot: typeof imports.isHot
    const Hmr: typeof imports.Hmr
}

globalify(imports)
