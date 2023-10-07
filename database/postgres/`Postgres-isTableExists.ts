import 'includes/postgres'
import Ns = Postgres

declare global {
    interface Postgres {
        isTableExists(sql: Postgres.Sql, database: string, name: string): Promise<boolean>
    }
}

Object.assign(Ns, {
    async isTableExists(sql: Postgres.Sql, database: string, name: string): Promise<boolean> {
        const [{ exists }] = await sql`
            SELECT EXISTS(
                SELECT *
                FROM information_schema.tables
                WHERE
                    table_catalog = ${database} AND
                    table_name = ${name}
            )
        `

        return exists
    },
})
