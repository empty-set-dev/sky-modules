import globalify from 'sky/utilities/globalify'

declare global {
    namespace Knex {}
}

globalify({ Knex: {} })
