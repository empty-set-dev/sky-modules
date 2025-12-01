import globalify from '@sky-modules/core/globalify'

import initSkyConfig, * as imports from '../init--sky-config'

declare global {
    const initSkyConfig: typeof imports.default
    type initSkyConfig = typeof imports.default
}

globalify({ initSkyConfig })
