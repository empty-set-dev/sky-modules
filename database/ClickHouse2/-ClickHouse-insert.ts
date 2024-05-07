export {}

declare global {
    namespace ClickHouse {
        const insert: (
            connection: ClickHouse,
            name: string,
            columns: string[],
            updateColumns: string[],
            values: [][]
        ) => Promise<{ id: number }[]>
    }
}

Object.assign(ClickHouse, {
    async insert(
        connection: ClickHouse,
        name: string,
        columns: string[],
        updateColumns: string[],
        values: unknown[][]
    ): Promise<Object[]> {
        return await connection
            .query(
                `
                    INSERT INTO \`${name}\`
                        (${columns.map(column => `\`${column}\``).join(',')})
                    VALUES ${values
                        .map(values_ => `(${values_.map(value => Mysql.value(value)).join(',')})`)
                        .join(',')}
                    ${
                        updateColumns.length > 0
                            ? `
                                ON DUPLICATE KEY UPDATE
                                    ${updateColumns.map(
                                        column => `\`${column}\`=VALUES(\`${column}\`)`
                                    )}
                            `
                            : ''
                    }
                `
            )
            .toPromise()
    },
})
