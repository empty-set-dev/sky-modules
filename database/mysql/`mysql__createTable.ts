import { Connection, Pool } from 'includes/mysql'

// import mysql__getTableColumns from './`mysql__getTableColumns'
// import mysql__getTableIndexes from './`mysql__getTableIndexes'
import mysql__isTableExists from './`mysql__isTableExists'
import { mysql__Column, mysql__Index } from './`mysql__types'

export default async function mysql__createTable(
    connection: Connection | Pool,
    database: string,
    name: string,
    columns: mysql__Column[],
    indexes?: mysql__Index[],
    partitions?: string
): Promise<void> {
    if (await mysql__isTableExists(connection, database, name)) {
        // const existsColumns = await mysql__getTableColumns(connection, name)
        // // eslint-disable-next-line no-console
        // console.log(existsColumns)
        // const existsIndexes = await mysql__getTableIndexes(connection, name)
        // // eslint-disable-next-line no-console
        // console.log(existsIndexes)
    } else {
        createTable(connection, name, columns, indexes, partitions)
    }
}

async function createTable(
    connection: Connection | Pool,
    name: string,
    columns: mysql__Column[],
    indexes?: mysql__Index[],
    partitions?: string
): Promise<Awaited<ReturnType<typeof connection.query>>> {
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

    return await connection.query(`CREATE TABLE IF NOT EXISTS \`${name}\` ${argsQuery}`)
}
