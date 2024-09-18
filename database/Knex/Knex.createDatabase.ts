import { Knex } from '@pkgs/knex'
import globalify from 'sky/helpers/globalify'

declare global {
    namespace Knex {
        function createDatabase(knex: Knex, name: string): Promise<void>
    }
}

globalify(lib)

namespace lib {
    export async function createDatabase(knex: Knex, name: string): Promise<void> {
        await knex.raw('CREATE DATABASE IF NOT EXISTS ??', name)
    }
}
