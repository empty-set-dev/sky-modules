export {}

declare global {
    namespace ClickHouse {
        const isTableExists: (
            connection: ClickHouse,
            database: string,
            name: string
        ) => Promise<boolean>
    }
}

Object.assign(ClickHouse, {
    async isTableExists(connection: ClickHouse, database: string, name: string): Promise<boolean> {
        const result = await connection
            .query(
                `
                    SELECT * 
                    FROM information_schema.tables
                    WHERE
                        table_catalog = '${database}' AND
                        table_name = '${name}'
                    LIMIT 1
                `
            )
            .toPromise()

        return result.length > 0
    },
})
