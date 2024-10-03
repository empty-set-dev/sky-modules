import ClickHouse from '@pkgs/clickhouse'

const clickhouse = new ClickHouse({
    url: 'http://localhost',
})

logConsole('ClickHouse sesseionId', clickhouse.sessionId)
