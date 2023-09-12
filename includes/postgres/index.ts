import globalify from 'base/globalify/defaultly'

import * as local from './defaultly'

globalify({ mysql: local.default })

declare global {
    const postgres: typeof local.default
}
