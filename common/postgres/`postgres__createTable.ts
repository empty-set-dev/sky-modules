import postgres from 'includes/postgres/defaultly'

// import postgres__getTableColumns from './`postgres__getTableColumns'
// import postgres__getTableIndexes from './`postgres__getTableIndexes'
import postgres__isTableExists from './`postgres__isTableExists'
import { postgres__Column, postgres__Index } from './`postgres__types'

export default async function postgres__createTable(
    sql: postgres.Sql,
    database: string,
    name: string,
    columns: postgres__Column[],
    indexes?: postgres__Index[],
    partitions?: string
): Promise<void> {
    if (await postgres__isTableExists(sql, database, name)) {
        // const existsColumns = await postgres__getTableColumns(connection, name)
        // // eslint-disable-next-line no-console
        // console.log(existsColumns)
        // const existsIndexes = await postgres__getTableIndexes(connection, name)
        // // eslint-disable-next-line no-console
        // console.log(existsIndexes)
    } else {
        createTable(sql, name, columns, indexes, partitions)
    }
}

async function createTable(
    sql: postgres.Sql,
    name: string,
    columns: postgres__Column[],
    indexes?: postgres__Index[],
    partitions?: string
): Promise<Awaited<ReturnType<typeof sql>>> {
    const argsQuery = `(
        ${columns
            .map(
                column => `
                    \`${column.name}\`
                    ${column.type}
                    ${column.primary ? `PRIMARY KEY` : ''}
                    ${column.autoIncrement ? `AUTO_INCREMENT` : ''}
                    ${column.unique ? `UNIQUE` : ''}
                    ${column.default != null ? `DEFAULT(${column.default})` : ''}
                    ${column.notNull ? `NOT NULL` : ''}
                    ${column.codepage ? `${column.codepage}` : ''}
                `
            )
            .join(',')}

        ${indexes?.length ? ',' : ''}
        ${indexes?.map(
            index => `
                ${index.type} ${index.name ? index.name : ''}(
                    ${index.columns.map(column => `\`${column}\``).join(',')}
                )
            `
        )}
    )
    ${partitions ? partitions : ''}`

    return await sql`CREATE TABLE IF NOT EXISTS \`${name}\` ${argsQuery}`
}
