/// <reference types="./-clickhouse" />

import globalify from 'helpers/globalify'

import module from './-clickhouse'

globalify({
    ClickHouse: module,
})
