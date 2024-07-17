export {}

declare global {
    namespace Mysql {
        const getTableColumns: (
            connection: Connection | Pool,
            name: string
        ) => Promise<Mysql.RowDataPacket[]>
    }
}

Object.assign(Mysql, {
    async getTableColumns(
        connection: Mysql.Connection | Mysql.Pool,
        name: string
    ): Promise<Mysql.RowDataPacket[]> {
        const result = (await connection.query(`
            SELECT \`COLUMN_NAME\`
            FROM information_schema.columns
            WHERE \`TABLE_NAME\`='${name}'
        `)) as Mysql.RowDataPacket[][]

        return result[0]
    },
})
