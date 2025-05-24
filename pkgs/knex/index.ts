import module from 'knex'

const {
    Client,
    ColumnBuilder,
    Knex,
    KnexTimeoutError,
    QueryBuilder,
    SchemaBuilder,
    TableBuilder,
    ViewBuilder,
} = module

export default module

type Knex = module.Knex
type CreateTableBuilder = module.Knex.CreateTableBuilder

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
