import globalify from 'sky/helpers/globalify'

globalify({ Knex: {} })

declare global {
    namespace Knex {}
}
