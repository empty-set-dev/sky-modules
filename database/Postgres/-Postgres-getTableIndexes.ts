import { Sql } from 'postgres'

declare global {
    namespace Postgres {
        const getTableIndexes: (sql: Postgres.Sql, name: string) => Promise<unknown>
    }
}

Object.assign(Postgres, {
    async getTableIndexes(sql: Postgres.Sql, name: string): Promise<unknown> {
        const result = await sql`
           SHOW INDEX FROM ${sql(name)}
       `
        return result[0]
    },
})
