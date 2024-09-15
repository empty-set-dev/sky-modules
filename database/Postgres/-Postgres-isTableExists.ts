import { Sql } from 'postgres'

declare global {
    namespace Postgres {
        const isTableExists: (sql: Postgres.Sql, database: string, name: string) => Promise<boolean>
    }
}

Object.assign(Postgres, {
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
