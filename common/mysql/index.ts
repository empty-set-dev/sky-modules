import 'includes/mysql'
import globalify from 'base/globalify/defaultly'

import { mysql__Column, mysql__Index } from './`mysql__types'
import * as local from './defaultly'
import { Connection, Pool, RowDataPacket } from './defaultly'

globalify({
    mysql__createDatabase: local.mysql__createDatabase,
    mysql__createTable: local.mysql__createTable,
    mysql__getTableColumns: local.mysql__getTableColumns,
    mysql__getTableIndexes: local.mysql__getTableIndexes,
    mysql__insert: local.mysql__insert,
    mysql__isTableExists: local.mysql__isTableExists,
    mysql__useDatabase: local.mysql__useDatabase,
})

declare global {
    function mysql__createDatabase(connection: Connection | Pool, name: string): Promise<void>

    function mysql__createTable(
        connection: Connection | Pool,
        name: string,
        columns: mysql__Column[],
        indexes?: mysql__Index[]
    ): Promise<Awaited<ReturnType<typeof connection.query>>>

    function mysql__getTableColumns(
        connection: Connection | Pool,
        name: string
    ): Promise<RowDataPacket[]>

    function mysql__getTableIndexes(
        connection: Connection | Pool,
        name: string
    ): Promise<RowDataPacket[]>

    function mysql__insert(
        connection: Connection | Pool,
        name: string,
        columns: string[],
        values: unknown[][]
    ): Promise<void>

    function mysql__isTableExists(connection: Connection | Pool, name: string): Promise<boolean>

    function mysql__useDatabase(connection: Connection | Pool, name: string): Promise<void>
}
