import './Knex'
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
        customCreate?: string
    }

    export async function createTable(
        knex: KnexType.Knex,
        params: CreateTableParams
    ): Promise<void> {
        if (!(await knex.schema.hasTable(params.name))) {
            let sql = await knex.schema
                .createTable(params.name, table => {
                    params.engine && table.engine(params.engine)
                    table.bigIncrements()
                })
                .toString()

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
                    let sql = await knex.schema
                        .table(params.name, table => column.createHandler(knex, table as never))
                        .toString()

                    if (knex.client.dialect === 'clickhouse') {
                        sql = sql.replace('add `', 'add column `')
                        sql = sql.replaceAll(/add index (`.+\))/g, 'add index $1 type MinMax')
                        sql = sql.replaceAll(
                            /add unique (`.+`)(\(.+\))/g,
                            'add constraint $1 check unique$2'
                        )
                    }

                    const sqls = sql.split(';\n')

                    for (const sql of sqls) {
                        await knex.raw(sql)
                    }
                }
            })
        )
    }
}

Object.assign(Knex, lib)
