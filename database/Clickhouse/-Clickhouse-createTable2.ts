export {}

declare global {
    namespace ClickHouse {
        const createTable: (
            connection: ClickHouse,
            database: string,
            name: string,
            columns: ClickHouse.Column[],
            indexes?: ClickHouse.Index[],
            partitions?: string
        ) => Promise<void>
    }
}

Object.assign(ClickHouse, {
    async createTable(
        connection: ClickHouse,
        database: string,
        name: string,
        columns: ClickHouse.Column[],
        indexes?: ClickHouse.Index[],
        partitions?: string
    ): Promise<void> {
        if (await ClickHouse.isTableExists(connection, database, name)) {
            throw new Error(`ClickHouse: table ${database} ${name} is exists`)
        } else {
            await createTable(connection, name, columns, indexes, partitions)
        }
    },
})

async function createTable(
    connection: ClickHouse,
    name: string,
    columns: ClickHouse.Column[],
    indexes?: ClickHouse.Index[],
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
