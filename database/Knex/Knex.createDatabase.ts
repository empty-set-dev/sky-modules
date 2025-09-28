import KnexType from 'knex'
import globalify from '@sky-modules/core/globalify'

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

globalify.namespace('Knex', lib)
