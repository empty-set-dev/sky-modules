import './-Postgres-types'

import Ns = Postgres

declare global {
    interface Postgres {
        createIndexes(sql: Postgres.Sql, name: string, indexes?: Ns.Index[]): Promise<void>
    }
}

Object.assign(Ns, {
    async createIndexes(sql: Postgres.Sql, name: string, indexes: Ns.Index[]): Promise<void> {
        for (let i = 0; i < indexes?.length; ++i) {
            if (indexes[i].type === 'UNIQUE') {
                await sql`CREATE UNIQUE INDEX IF NOT EXISTS ${sql(
                    name.toLowerCase() + '' + indexes[i].name!.toLowerCase()
                )} ON ${sql(name)}(${sql(indexes[i].columns.map(c => c.toLowerCase()))})`
            } else if (indexes[i].type === 'INDEX') {
                await sql`CREATE INDEX IF NOT EXISTS ${sql(
                    name.toLowerCase() + '' + indexes[i].name!.toLowerCase()
                )} ON ${sql(name)}(${sql(indexes[i].columns.map(c => c.toLowerCase()))})`
            }
        }
    },
})
