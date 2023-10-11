import 'includes/postgres/global'
import Ns = Postgres

declare global {
    interface Postgres {
        useDatabase(sql: Postgres.Sql, name: string): Promise<void>
    }
}

Object.assign(Ns, {
    async useDatabase(sql: Postgres.Sql, name: string): Promise<void> {
        await sql`USE ${sql(name)}`
    },
})
