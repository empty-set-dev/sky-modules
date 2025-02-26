import './Knex'
import KnexType from 'knex'

declare global {
    namespace Knex {
        function createDatabase(knex: KnexType.Knex, name: string): Promise<void>
    }
}

namespace lib {
    export async function createDatabase(knex: KnexType.Knex, name: string): Promise<void> {
        await knex.raw('CREATE DATABASE IF NOT EXISTS ??', name)
    }
}

Object.assign(global.Knex, lib)
