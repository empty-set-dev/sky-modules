import './-Postgres-getTableColumns'
import './-Postgres-getTableIndexes'
import './-Postgres-types'
import './-Postgres-createIndexes'
import './-Postgres-isTableExists'

import Ns = Postgres

declare global {
    interface Postgres {
        createTable(
            sql: Postgres.Sql,
            database: string,
            name: string,
            columns: Ns.Column[],
            indexes?: Ns.Index[]
        ): Promise<void>
    }
}

Object.assign(Ns, {
    async createTable(
        sql: Postgres.Sql,
        database: string,
        name: string,
        columns: Ns.Column[],
        indexes?: Ns.Index[]
    ): Promise<void> {
        if (await Ns.isTableExists(sql, database, name)) {
            // const existsColumns = await getTableColumns(connection, name)
            // // eslint-disable-next-line no-console
            // console.log(existsColumns)
            // const existsIndexes = await getTableIndexes(connection, name)
            // // eslint-disable-next-line no-console
            // console.log(existsIndexes)
        } else {
            await createTable(sql, name, columns)
        }

        await Ns.createIndexes(sql, name, indexes)
    },
})

async function createTable(sql: Postgres.Sql, name: string, columns: Ns.Column[]): Promise<void> {
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
