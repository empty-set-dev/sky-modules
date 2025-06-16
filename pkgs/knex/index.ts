import lib from 'knex'

const {
    Client,
    ColumnBuilder,
    Knex,
    KnexTimeoutError,
    QueryBuilder,
    SchemaBuilder,
    TableBuilder,
    ViewBuilder,
} = lib

export default lib

type Knex = lib.Knex
type CreateTableBuilder = lib.Knex.CreateTableBuilder

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
