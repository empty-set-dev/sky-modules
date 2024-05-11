import globalify from 'helpers/globalify'

import module from '.'

globalify({ Sql })

declare global {
    namespace Sql {
        type SqlType = 'mysql' | 'postgres' | 'clickhouse'
        function connect(options: module.Options): Promise<Sql>
    }
    type Sql = module
}
