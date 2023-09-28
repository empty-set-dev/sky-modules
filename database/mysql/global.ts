import globalify from 'utilities/globalify'

import 'includes/mysql/global'

import * as module from '.'
import { Connection, Pool, RowDataPacket, mysql__Column, mysql__Index } from '.'

globalify({
    mysql__createDatabase: module.mysql__createDatabase,
    mysql__createTable: module.mysql__createTable,
    mysql__getTableColumns: module.mysql__getTableColumns,
    mysql__getTableIndexes: module.mysql__getTableIndexes,
    mysql__insert: module.mysql__insert,
    mysql__isTableExists: module.mysql__isTableExists,
    mysql__select: module.mysql__select,
    mysql__useDatabase: module.mysql__useDatabase,
    mysql__value: module.mysql__value,
})

declare global {
    function mysql__createDatabase(connection: Connection | Pool, name: string): Promise<void>

    function mysql__createTable(
        connection: Connection | Pool,
        database: string,
        name: string,
        columns: mysql__Column[],
        indexes?: mysql__Index[],
        partitions?: string
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
        updateColumns: string[],
        values: unknown[][]
    ): Promise<{ insertedId: number }[]>

    function mysql__isTableExists(
        connection: Connection | Pool,
        database: string,
        name: string
    ): Promise<boolean>

    function mysql__select(
        connection: Connection | Pool,
        name: string,
        columns: string[],
        query?: string
    ): Promise<RowDataPacket[]>

    function mysql__useDatabase(connection: Connection | Pool, name: string): Promise<void>

    function mysql__value(value: unknown): unknown
}
