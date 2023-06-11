import globalify from 'base/globalify/`globalify'

import * as local from './defaultly'

globalify({ react: local.default })

declare global {
    const React: typeof local.default
}
