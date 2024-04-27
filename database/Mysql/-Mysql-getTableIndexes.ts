export {}

declare global {
    namespace Mysql {
        const getTableIndexes: (
            connection: Connection | Pool,
            name: string
        ) => Promise<Mysql.RowDataPacket[]>
    }
}

Object.assign(Mysql, {
    async getTableIndexes(
        connection: Mysql.Connection | Mysql.Pool,
        name: string
    ): Promise<Mysql.RowDataPacket[]> {
        const result = (await connection.query(`
            SHOW INDEX FROM \`${name}\`
        `)) as Mysql.RowDataPacket[][]
        return result[0]
    },
})
