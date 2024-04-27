export {}

declare global {
    namespace Mysql {
        const select: <T>(
            connection: Connection | Pool,
            name: string,
            columns: string[],
            query?: string
        ) => Promise<T[]>
    }
}

Object.assign(Mysql, {
    async select(
        connection: Mysql.Connection | Mysql.Pool,
        name: string,
        columns: string[],
        query?: string
    ): Promise<Mysql.RowDataPacket[]> {
        return (
            await connection.query(`
                SELECT ${columns.map(column => `\`${column}\``).join(',')}
                FROM \`${name}\`
                ${query ? query : ''}
            `)
        )[0] as Mysql.RowDataPacket[]
    },
})
