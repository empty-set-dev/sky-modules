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
        console.log('CREATE', name)
        return await createTable(sql, name, columns, indexes, partitions)
    }
}

async function createTable(
    sql: postgres.Sql,
    name: string,
    columns: postgres__Column[],
    indexes?: postgres__Index[],
    partitions?: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
    try {
        const argsQuery = (): string =>
            `
        (
            ${columns
                .map(
                    column => `
                        "${column.name.toLowerCase()}"
                        ${column.autoIncrement ? `BIGSERIAL` : column.type}
                        ${column.primary ? `PRIMARY KEY` : ''}
                        ${column.unique ? `UNIQUE` : ''}
                        ${column.default != null ? `DEFAULT(${column.default})` : ''}
                        ${column.notNull ? `NOT NULL` : ''}
                        ${column.codepage ? `${column.codepage}` : ''}
                    `
                )
                .join(',')}

            ${indexes?.filter(index => index.type !== 'INDEX')?.length ? ',' : ''}
            ${indexes
                ?.filter(index => index.type !== 'INDEX')
                ?.map(
                    index => `
                    ${
                        index.type === 'INDEX'
                            ? ``
                            : `CONSTRAINT ${
                                  index.name
                                      ? '"' + name + '_' + index.name.toLowerCase() + '"'
                                      : ''
                              } ${index.type} (
                                ${index.columns
                                    .map(column => `"${column.toLowerCase()}"`)
                                    .join(',')}
                            )`
                    }
                `
                )
                .join(',')}
        )
    `
                .replaceAll('\n', '')
                .replaceAll('  ', ' ')
                .replaceAll('  ', ' ')
                .replaceAll('  ', ' ')
                .replaceAll('  ', ' ')
                .replaceAll('  ', ' ')
                .replaceAll('  ', ' ')
                .replaceAll('  ', ' ')
                .replaceAll('  ', ' ')
                .replaceAll('  ', ' ')

        await sql`CREATE TABLE ${sql(name)} ${sql.unsafe(argsQuery())}`
        const indexes_ = indexes?.filter(index => index.type === 'INDEX')
        if (indexes_) {
            for (let i = 0; i < indexes_?.length; ++i) {
                await sql`CREATE INDEX ${sql(indexes_[i].name!.toLowerCase())} ON ${sql(
                    name.toLowerCase()
                )}(${sql(indexes_[i].columns.map(c => c.toLowerCase()))})`
            }
        }
    } catch (err: any) {
        console.log(err)
    }
    return {} as any
}
