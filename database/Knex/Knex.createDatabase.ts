import { Knex } from 'knex'
import globalify from 'sky/helpers/globalify'

declare global {
    namespace Knex {
        function createDatabase(knex: Knex, name: string): Promise<void>
    }
}

namespace lib {
    export async function createDatabase(knex: Knex, name: string): Promise<void> {
        await knex.raw('CREATE DATABASE IF NOT EXISTS ??', name)
    }
}

globalify(lib)
