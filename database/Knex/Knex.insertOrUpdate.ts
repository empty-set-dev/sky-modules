import './Knex'
import KnexType from 'knex'

declare global {
    namespace Knex {
        function insertOrUpdate<T>(
            knex: KnexType.Knex,
            tableName: string,
            fieldsOnUpdate: string[],
            data: T[]
        ): Promise<number[]>
    }
}

namespace lib {
    export async function insertOrUpdate<T>(
        knex: KnexType.Knex,
        tableName: string,
        fieldsOnUpdate: string[],
        data: T[]
    ): Promise<number[]> {
        return await knex.raw(
            knex(tableName).insert(data).toQuery() +
                ' ON DUPLICATE KEY UPDATE ' +
                fieldsOnUpdate.map(field => `${field}=VALUES(${field})`).join(', ')
        )
    }
}

Object.assign(Knex, lib)
