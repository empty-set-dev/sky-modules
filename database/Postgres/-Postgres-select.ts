import 'libs/postgres/global'

declare global {
    namespace Postgres {
        const select: <T>(
            sql: Postgres.Sql,
            name: string,
            columns: string[],
            query?: string
        ) => Promise<T[] & { describe(): unknown }>
    }
}

Object.assign(Postgres, {
    async select<T>(
        sql: Postgres.Sql,
        name: string,
        columns: string[],
        query?: string
    ): Promise<T[]> {
        return (await sql`
            SELECT ${sql.unsafe(columns.map(c => `"${c.toLowerCase()}" as "${c}"`).join(', '))}
            FROM ${sql(name)}
            ${query ? query : sql``}
        `) as never
    },
})
