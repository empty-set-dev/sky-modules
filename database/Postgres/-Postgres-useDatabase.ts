import { Sql } from 'postgres'

declare global {
    namespace Postgres {
        const useDatabase: (sql: Postgres.Sql, name: string) => Promise<void>
    }
}

Object.assign(Postgres, {
    async useDatabase(sql: Postgres.Sql, name: string): Promise<void> {
        await sql`USE ${sql(name)}`
    },
})
