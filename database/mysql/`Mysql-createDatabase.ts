import 'includes/mysql2/global'
import { Connection, Pool } from 'mysql2'

import Ns = Mysql

declare global {
    interface Mysql {
        createDatabase(connection: Connection | Pool, name: string): Promise<void>
    }
}

Object.assign(Ns, {
    async createDatabase(connection: Connection | Pool, name: string): Promise<void> {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``)
    },
})
