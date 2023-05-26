import globalify from 'base/globalify/defaultly'

import * as local from './defaultly'

globalify({ axios: local.default })

declare global {
    const axios: typeof local.default
}
