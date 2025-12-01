import globalify from '@sky-modules/core/globalify'

import initTsConfigs, * as imports from '../init--ts-configs'

declare global {
    const initTsConfigs: typeof imports.default
    type initTsConfigs = typeof imports.default
}

globalify({ initTsConfigs })
