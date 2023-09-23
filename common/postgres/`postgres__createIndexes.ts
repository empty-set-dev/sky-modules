import postgres from 'postgres'

import { postgres__Index } from './`postgres__types'

export default async function createIndexes(
    sql: postgres.Sql,
    name: string,
    indexes?: postgres__Index[]
): Promise<void> {
    if (indexes) {
        for (let i = 0; i < indexes?.length; ++i) {
            if (indexes[i].type === 'UNIQUE') {
                await sql`CREATE UNIQUE INDEX IF NOT EXISTS ${sql(
                    name.toLowerCase() + '/' + indexes[i].name!.toLowerCase()
                )} ON ${sql(name)}(${sql(indexes[i].columns.map(c => c.toLowerCase()))})`
            } else if (indexes[i].type === 'INDEX') {
                await sql`CREATE INDEX IF NOT EXISTS ${sql(
                    name.toLowerCase() + '/' + indexes[i].name!.toLowerCase()
                )} ON ${sql(name)}(${sql(indexes[i].columns.map(c => c.toLowerCase()))})`
            }
        }
    }
}
