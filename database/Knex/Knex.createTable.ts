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
            createHandler: (table: KnexType.Knex.CreateTableBuilder) => void
        }[]
    }

    export async function createTable(
        knex: KnexType.Knex,
        params: CreateTableParams
    ): Promise<void> {
        if (!(await knex.schema.hasTable(params.name))) {
            await knex.schema.createTable(params.name, table => {
                table.increments()
            })
        }

        await Promise.all(
            params.columns.map(async column => {
                if (!(await knex.schema.hasColumn(params.name, column.name))) {
                    await knex.schema.alterTable(params.name, column.createHandler)
                }
            })
        )
    }
}

Object.assign(Knex, lib)
