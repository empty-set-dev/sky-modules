export {}

declare global {
    namespace ClickHouse {
        const getTableIndexes: (connection: ClickHouse, name: string) => Promise<Object[]>
    }
}

Object.assign(ClickHouse, {
    async getTableIndexes(connection: ClickHouse, name: string): Promise<Object[]> {
        const result = await connection
            .query(
                `
                    SHOW INDEX FROM \`${name}\`
                `
            )
            .toPromise()
        return result
    },
})
