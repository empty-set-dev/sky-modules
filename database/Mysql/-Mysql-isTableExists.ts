export {}

declare global {
    namespace Mysql {
        const isTableExists: (
            connection: Mysql.Connection | Mysql.Pool,
            database: string,
            name: string
        ) => Promise<boolean>
    }
}

Object.assign(Mysql, {
    async isTableExists(
        connection: Mysql.Connection | Mysql.Pool,
        database: string,
        name: string
    ): Promise<boolean> {
        const result = (await connection.query(`
            SELECT * 
            FROM information_schema.tables
            WHERE
                table_catalog = '${database}' AND
                table_name = '${name}'
            LIMIT 1
        `)) as Mysql.RowDataPacket[][]

        return result[0].length > 0
    },
})
