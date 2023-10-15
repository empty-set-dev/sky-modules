export {}

declare global {
    interface Postgres {
        getTableColumns(sql: Postgres.Sql, name: string): Promise<unknown>
    }
}

namespace module {
    export const getTableColumns = async (sql: Postgres.Sql, name: string): Promise<unknown> => {
        const result = await sql`
            SELECT "COLUMN_NAME"
            FROM information_schema.columns
            WHERE "TABLE_NAME"=${name}
        `

        return result[0]
    }
}

Object.assign(Postgres, module)
