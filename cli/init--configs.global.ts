import globalify from '@sky-modules/core/globalify'

import initConfigs, * as imports from './init--configs'

declare global {
    const initConfigs: typeof imports.default
    type initConfigs = typeof imports.default
}

globalify({ initConfigs })
