import { Connection, Pool } from 'includes/mysql'

import './`Mysql'
import Ns = Mysql

declare global {
    namespace Mysql {
        function createDatabase(connection: Connection | Pool, name: string): Promise<void>
    }
}

Object.assign(Ns, {
    async createDatabase(connection: Connection | Pool, name: string): Promise<void> {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``)
    },
})
