import 'includes/postgres.global'
import Ns = Postgres

declare global {
    namespace Postgres {
        const insert: (
            sql: Postgres.Sql,
            name: string,
            columns: string[],
            conflict: string | string[],
            updateColumns: string[],
            values: unknown[][]
        ) => Promise<unknown[]>
    }
}

Object.assign(Ns, {
    async insert(
        sql: Postgres.Sql,
        name: string,
        columns: string[],
        conflict: string | string[],
        updateColumns: string[],
        values: unknown[][]
    ): Promise<unknown[]> {
        if (Array.isArray(conflict)) {
            conflict = conflict.map(c => c.toLowerCase())
        } else {
            conflict = [conflict]
        }

        return (await sql`
            INSERT INTO ${sql(name)}
            (${sql.unsafe(columns.map(column => `"${column.toLowerCase()}"`).join(','))})
            VALUES ${sql(values as never)}
            ${
                updateColumns.length > 0
                    ? sql`
                        ON CONFLICT (${sql(conflict)}) DO UPDATE SET
                            ${sql.unsafe(
                                updateColumns
                                    .map(
                                        column =>
                                            `"${column.toLowerCase()}"=excluded."${column.toLowerCase()}"`
                                    )
                                    .join(',')
                            )}
                    `
                    : sql``
            }
            returning *
        `) as unknown as unknown[]
    },
})
