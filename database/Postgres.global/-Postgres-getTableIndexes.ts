import 'includes/postgres.global'
import Ns = Postgres

declare global {
    interface Postgres {
        getTableIndexes(sql: Postgres.Sql, name: string): Promise<unknown>
    }
}

namespace module {
    export const getTableIndexes = async (sql: Postgres.Sql, name: string): Promise<unknown> => {
        const result = await sql`
           SHOW INDEX FROM ${sql(name)}
       `
        return result[0]
    }
}

Object.assign(Ns, module)
