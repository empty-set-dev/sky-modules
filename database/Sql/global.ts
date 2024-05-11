import globalify from 'helpers/globalify'

import Sql from '.'

globalify({ Sql })

declare global {
    function connect(options: Sql.Options): Promise<Sql>
}
