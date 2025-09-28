import './Knex.table'

import KnexType from 'knex'
import globalify from '@sky-modules/core/globalify'

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
        noPrimaryId?: boolean
        orderBy?: string[]
        engine?: string
    }

    export async function createTable(
        knex: KnexType.Knex,
        params: CreateTableParams
    ): Promise<void> {
        let engine = params.engine

        if (knex.client.dialect === 'clickhouse') {
            engine ??= 'ReplacingMergeTree'
        }

        if (!(await knex.schema.hasTable(params.name))) {
            let sql = await knex.schema
                .createTable(params.name, table => {
                    engine && table.engine(engine)

                    if (params.noPrimaryId !== true) {
                        table.bigIncrements()
                    }

                    params.columns.map(column => {
                        column.createHandler(knex, table)
                    })
                })
                .toQuery()

            if (knex.client.dialect === 'clickhouse') {
                sql = sql.replace(
                    '`id` UUID default generateUUIDv4()',
                    '`id` UUID default generateUUIDv4() primary key'
                )
            }

            const sign = sql.indexOf(';')
            let create = sql.slice(0, sign)
            const alter = sql.slice(sign + 1).split(';')

            if (params.orderBy) {
                create += ` order by (${params.orderBy.join(',')})`
            }

            await knex.raw(create)

            for (let i = 0; i < alter.length; ++i) {
                await knex.raw(alter[i] + ' type minmax')
            }
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

globalify.namespace('Knex', lib)
