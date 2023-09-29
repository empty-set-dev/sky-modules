import 'includes/mysql2/global'
import { Connection, Pool } from 'includes/mysql2'

import Ns = Mysql

declare global {
    interface Mysql {
        useDatabase(connection: Connection | Pool, name: string): Promise<void>
    }
}

Object.assign(Ns, {
    async useDatabase(connection: Connection | Pool, name: string): Promise<void> {
        await connection.query(`USE \`${name}\``)
    },
})
