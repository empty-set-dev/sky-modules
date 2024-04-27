export {}

declare global {
    namespace Postgres {
        const createTable: (
            sql: Postgres.Sql,
            database: string,
            name: string,
            columns: Postgres.Column_[],
            indexes?: Postgres.Index[]
        ) => Promise<void>
    }
}

async function __createTable(
    sql: Postgres.Sql,
    name: string,
    columns: Postgres.Column_[]
): Promise<void> {
    const argsQuery = `
        (
            ${columns
                .map(
                    column => `
                        ${column.name.toLowerCase()}
                        ${column.autoIncrement ? `BIGSERIAL` : column.type}
                        ${column.primary ? `PRIMARY KEY` : ''}
                        ${column.unique ? `UNIQUE` : ''}
                        ${column.default != null ? `DEFAULT(${column.default})` : ''}
                        ${column.notNull ? `NOT NULL` : ''}
                        ${column.codepage ? `${column.codepage}` : ''}
                    `
                )
                .join(',')}
        )
    `

    await sql`CREATE TABLE ${sql(name)} ${sql.unsafe(argsQuery)}`
}

Object.assign(Postgres, {
    async createTable(
        sql: Postgres.Sql,
        database: string,
        name: string,
        columns: Postgres.Column_[],
        indexes?: Postgres.Index[]
    ): Promise<void> {
        if (await Postgres.isTableExists(sql, database, name)) {
            // const existsColumns = await getTableColumns(connection, name)
            // // eslint-disable-next-line no-console
            // console.log(existsColumns)
            // const existsIndexes = await getTableIndexes(connection, name)
            // // eslint-disable-next-line no-console
            // console.log(existsIndexes)
            // TODO recreate table
        } else {
            await __createTable(sql, name, columns)
            await Postgres.createIndexes(sql, name, indexes)
        }
    },
})
