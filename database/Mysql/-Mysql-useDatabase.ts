export {}

import Ns = Mysql

declare global {
    namespace Mysql {
        const useDatabase: (connection: Connection | Pool, name: string) => Promise<void>
    }
}

Object.assign(Ns, {
    async useDatabase(connection: Mysql.Connection | Mysql.Pool, name: string): Promise<void> {
        await connection.query(`USE \`${name}\``)
    },
})
