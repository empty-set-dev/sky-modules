import postgres from 'includes/postgres'

// import postgres__getTableColumns from './`postgres__getTableColumns'
// import postgres__getTableIndexes from './`postgres__getTableIndexes'
import createIndexes from './`postgres__createIndexes'
import postgres__isTableExists from './`postgres__isTableExists'
import { postgres__Column, postgres__Index } from './`postgres__types'

export default async function postgres__createTable(
    sql: postgres.Sql,
    database: string,
    name: string,
    columns: postgres__Column[],
    indexes?: postgres__Index[]
): Promise<void> {
    if (await postgres__isTableExists(sql, database, name)) {
        // const existsColumns = await postgres__getTableColumns(connection, name)
        // // eslint-disable-next-line no-console
        // console.log(existsColumns)
        // const existsIndexes = await postgres__getTableIndexes(connection, name)
        // // eslint-disable-next-line no-console
        // console.log(existsIndexes)
    } else {
        // eslint-disable-next-line no-console
        console.log(name, columns, indexes)
        await createTable(sql, name, columns)
    }

    await createIndexes(sql, name, indexes)
}

async function createTable(
    sql: postgres.Sql,
    name: string,
    columns: postgres__Column[]
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
