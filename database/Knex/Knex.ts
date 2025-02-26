import globalify from 'sky/helpers/globalify'

declare global {
    namespace Knex {}
}

globalify({ Knex })
