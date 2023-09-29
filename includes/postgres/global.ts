import globalify from 'utilities/globalify'

import * as module from '.'

globalify({ Postgres: module.default })

declare global {
    namespace Postgres {
        type Sql = module.default.Sql
    }
    interface Postgres {}
    const Postgres: typeof module.default & Postgres
}
