/// <reference types="./-clickhouse" />

import ClickHouse from '@clickhouse/client'
import globalify from 'sky/helpers/globalify'

globalify({
    ClickHouse,
})
