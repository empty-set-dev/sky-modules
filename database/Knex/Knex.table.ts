import KnexType from 'knex'
import globalify from 'sky/utilities/globalify'

declare global {
    namespace Knex {
        interface TableParams extends module.TableParams {}
        function table(knex: KnexType.Knex, params: TableParams): Promise<void>
    }
}

namespace module {
    export interface TableParams {
        name: string
        handler: (knex: KnexType.Knex, table: KnexType.Knex.CreateTableBuilder) => void
    }

    export async function table(knex: KnexType.Knex, params: TableParams): Promise<void> {
        let sql = await knex.schema
            .table(params.name, table => params.handler(knex, table as never))
            .toQuery()

        if (knex.client.dialect === 'clickhouse') {
            sql = sql.replace('add `', 'add column `')
            sql = sql.replaceAll(/add index (`.+\))/g, 'add index $1 type MinMax')
            sql = sql.replaceAll(/add unique (`.+`)(\(.+\))/g, 'add constraint $1 check unique$2')
        }

        const sqls = sql.split(';\n')

        for (const sql of sqls) {
            await knex.raw(sql)
        }
    }
}

globalify.namespace('Knex', module)
