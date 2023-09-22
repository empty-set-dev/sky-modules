import globalify from 'base/globalify'

import 'includes/postgres/global'

import * as module from '.'
import postgres, { postgres__Column, postgres__Index } from '.'

globalify({
    postgres__createTable: module.postgres__createTable,
    postgres__createIndexes: module.postgres__createIndexes,
    postgres__getTableColumns: module.postgres__getTableColumns,
    postgres__getTableIndexes: module.postgres__getTableIndexes,
    postgres__insert: module.postgres__insert,
    postgres__isTableExists: module.postgres__isTableExists,
    postgres__select: module.postgres__select,
    postgres__useDatabase: module.postgres__useDatabase,
})

declare global {
    function postgres__createDatabase(sql: postgres.Sql, name: string): Promise<void>

    function postgres__createTable(
        sql: postgres.Sql,
        database: string,
        name: string,
        columns: postgres__Column[],
        indexes?: postgres__Index[]
    ): Promise<void>

    function postgres__createIndexes(
        sql: postgres.Sql,
        database: string,
        name: string,
        indexes?: postgres__Index[]
    ): Promise<void>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function postgres__getTableColumns(sql: postgres.Sql, name: string): Promise<any[]>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function postgres__getTableIndexes(sql: postgres.Sql, name: string): Promise<any[]>

    function postgres__insert(
        sql: postgres.Sql,
        name: string,
        columns: string[],
        conflict: string,
        updateColumns: string[],
        values: unknown[]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any[]>

    function postgres__isTableExists(
        sql: postgres.Sql,
        database: string,
        name: string
    ): Promise<boolean>

    function postgres__select(
        sql: postgres.Sql,
        name: string,
        columns: string[],
        query?: string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any>

    function postgres__useDatabase(sql: postgres.Sql, name: string): Promise<void>
}
