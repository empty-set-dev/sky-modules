export {}

declare global {
    namespace ClickHouse {
        const createDatabase: (connection: ClickHouse, name: string) => Promise<void>
    }
}

Object.assign(Mysql, {
    async createDatabase(connection: ClickHouse, name: string): Promise<void> {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\``).toPromise()
    },
})
