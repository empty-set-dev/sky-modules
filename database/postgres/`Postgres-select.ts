import 'includes/postgres/global'
import Ns = Postgres

declare global {
    interface Postgres {
        select(
            sql: postgres.Sql,
            name: string,
            columns: string[],
            query?: string
        ): Promise<unknown[]>
    }
}

Object.assign(Ns, {
    async select(
        sql: postgres.Sql,
        name: string,
        columns: string[],
        query?: string
    ): Promise<unknown[]> {
        return (await sql`
            SELECT ${sql.unsafe(columns.map(c => `"${c.toLowerCase()}" as "${c}"`).join(', '))}
            FROM ${sql(name)}
            ${query ? query : sql``}
        `) as unknown as unknown[]
    },
})
