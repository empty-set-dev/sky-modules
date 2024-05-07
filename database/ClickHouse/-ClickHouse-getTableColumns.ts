export {}

declare global {
    namespace ClickHouse {
        const getTableColumns: (connection: ClickHouse, name: string) => Promise<Object[]>
    }
}

Object.assign(ClickHouse, {
    async getTableColumns(connection: ClickHouse, name: string): Promise<Object[]> {
        const result = await connection
            .query(
                `
                    SELECT \`COLUMN_NAME\`
                    FROM information_schema.columns
                    WHERE \`TABLE_NAME\`='${name}'
                `
            )
            .toPromise()

        return result
    },
})
