import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ axios: module.default })

declare global {
    interface axios {}
    const axios: typeof module.default & axios
}
