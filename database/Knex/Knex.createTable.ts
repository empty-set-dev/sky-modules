import './Knex'
import './Knex.table'
import KnexType from 'knex'

declare global {
    namespace Knex {
        interface CreateTableParams extends lib.CreateTableParams {}
        function createTable(knex: KnexType.Knex, params: CreateTableParams): Promise<void>
    }
}

namespace lib {
    export interface CreateTableParams {
        name: string
        columns: {
            name: string
            createHandler: (knex: KnexType.Knex, table: KnexType.Knex.CreateTableBuilder) => void
        }[]
        engine?: string
    }

    export async function createTable(
        knex: KnexType.Knex,
        params: CreateTableParams
    ): Promise<void> {
        let engine = params.engine

        if (knex.client.dialect === 'clickhouse') {
            engine ??= 'MergeTree'
        }

        if (!(await knex.schema.hasTable(params.name))) {
            let sql = await knex.schema
                .createTable(params.name, table => {
                    engine && table.engine(engine)
                    table.bigIncrements()
                })
                .toQuery()

            if (knex.client.dialect === 'clickhouse') {
                sql = sql.replace(
                    '`id` UUID default generateUUIDv4()',
                    '`id` UUID default generateUUIDv4() primary key'
                )
            }

            await knex.raw(sql)
        }

        await Promise.all(
            params.columns.map(async column => {
                if (!(await knex.schema.hasColumn(params.name, column.name))) {
                    await Knex.table(knex, {
                        name: params.name,
                        handler: column.createHandler,
                    })
                }
            })
        )
    }
}

Object.assign(Knex, lib)
