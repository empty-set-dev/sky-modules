import 'includes/postgres'
import globalify from 'base/globalify/defaultly'

import { postgres__Column, postgres__Index } from './`postgres__types'
import * as local from './defaultly'
import postgres from './defaultly'

globalify({
    postgres__createTable: local.postgres__createTable,
    postgres__getTableColumns: local.postgres__getTableColumns,
    postgres__getTableIndexes: local.postgres__getTableIndexes,
    postgres__insert: local.postgres__insert,
    postgres__isTableExists: local.postgres__isTableExists,
    postgres__select: local.postgres__select,
    postgres__useDatabase: local.postgres__useDatabase,
})

declare global {
    function postgres__createDatabase(sql: postgres.Sql, name: string): Promise<void>

    function postgres__createTable(
        sql: postgres.Sql,
        database: string,
        name: string,
        columns: postgres__Column[],
        indexes?: postgres__Index[],
        partitions?: string
    ): Promise<Awaited<ReturnType<typeof sql>>>

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

    function postgres__isTableExists(sql: postgres.Sql, name: string): Promise<boolean>

    function postgres__select(
        sql: postgres.Sql,
        name: string,
        columns: string[],
        query?: () => string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any>

    function postgres__useDatabase(sql: postgres.Sql, name: string): Promise<void>
}
