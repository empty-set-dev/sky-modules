import '/includes/postgres'
import Ns = Postgres

declare global {
    interface Postgres {
        getTableIndexes(sql: Postgres.Sql, name: string): Promise<unknown>
    }
}

Object.assign(Ns, {
    async getTableIndexes(sql: Postgres.Sql, name: string): Promise<unknown> {
        const result = await sql`
           SHOW INDEX FROM ${sql(name)}
       `
        return result[0]
    },
})
