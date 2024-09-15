import { Sql } from '@pkgs/postgres'

declare global {
    namespace Postgres {
        const getTableColumns: (sql: Sql, name: string) => Promise<unknown>
    }
}

Object.assign(Postgres, {
    async getTableColumns(sql: Sql, name: string): Promise<unknown> {
        const result = await sql`
            SELECT "COLUMN_NAME"
            FROM information_schema.columns
            WHERE "TABLE_NAME"=${name}
        `

        return result[0]
    },
})
