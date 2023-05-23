import 'includes/mysql'
import globalify from 'base/globalify/defaultly'

import * as local from './defaultly'
import { FieldPacket, OkPacket, ResultSetHeader, RowDataPacket } from './defaultly'

globalify({
    mysql__pool_createDatabase: local.mysql__pool_createDatabase,
})

declare global {
    function mysql__pool_createDatabase(
        pool: Pool,
        name: string
    ): Promise<
        [
            RowDataPacket[] | RowDataPacket[][] | OkPacket | OkPacket[] | ResultSetHeader,
            FieldPacket[]
        ]
    >
}
