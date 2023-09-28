import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ Sql: module.default })

declare global {
    type Sql = module.default
    const Sql: typeof module.default
}
