import globalify from 'utilities/globalify'

import * as module from 'postgres'
import { Sql as Sql_ } from '../node_modules/postgres'

globalify({
    Postgres: (module as never as { default: never }).default,
})

declare global {
    namespace Postgres {
        type Sql = Sql_
    }
    const Postgres: typeof module
}
