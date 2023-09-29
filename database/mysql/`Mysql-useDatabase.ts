import { Connection, Pool } from 'includes/mysql'

import './`Mysql'
import Ns = Mysql

declare global {
    namespace Mysql {
        function useDatabase(connection: Connection | Pool, name: string): Promise<void>
    }
}

Object.assign(Ns, {
    async useDatabase(connection: Connection | Pool, name: string): Promise<void> {
        await connection.query(`USE \`${name}\``)
    },
})
