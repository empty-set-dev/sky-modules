import pkg from 'knex'

const {
    Client,
    ColumnBuilder,
    Knex,
    KnexTimeoutError,
    QueryBuilder,
    SchemaBuilder,
    TableBuilder,
    ViewBuilder,
} = pkg

export default pkg

type Knex = pkg.Knex
type CreateTableBuilder = pkg.Knex.CreateTableBuilder

export {
    Client,
    ColumnBuilder,
    Knex,
    KnexTimeoutError,
    QueryBuilder,
    SchemaBuilder,
    TableBuilder,
    ViewBuilder,
    CreateTableBuilder,
}
