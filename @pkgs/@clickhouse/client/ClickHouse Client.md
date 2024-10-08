<!--- This ClickHouse Client was auto-generated using "npx sky readme" --> 

# [Sky Docs](../../../README.md)

[Overview](..%2F..%2F..%2Fdocs%2FOverview.md)   
**[Packages](..%2F..%2F..%2F%40pkgs%2FPackages.md)**   
* **[ClickHouse Client](..%2F..%2F..%2F%40pkgs%2F%40clickhouse%2Fclient%2FClickHouse%20Client.md)**
  
[Platform](..%2F..%2F..%2F%40platform%2FPlatform.md)   
[Camera](..%2F..%2F..%2F%5Fexamples%2Fcameras%2FSkyPerspectiveCamera%2Fdocs%2FCamera.md)   
[Test](..%2F..%2F..%2F%5Fexamples%2Fcameras%2FSkyPerspectiveCamera%2Ftest%2FTest.md)   
[cameras](..%2F..%2F..%2Fcameras%2Fcameras.md)   
[components](..%2F..%2F..%2Fcomponents%2Fcomponents.md)   
[Crypto](..%2F..%2F..%2Fcrypto%2FCrypto.md)   
[Features](..%2F..%2F..%2Ffeatures%2FFeatures.md)   
[Helpers](..%2F..%2F..%2Fhelpers%2FHelpers.md)   
[Standard](..%2F..%2F..%2Fstandard%2FStandard.md)   

# [Packages](..%2F..%2F..%2F%40pkgs%2FPackages.md) / ClickHouse Client

## [ClickHouse Client](https://www.npmjs.com/package/@clickhouse/client)

[source](index.ts) [example](../../../%5Fexamples/@pkgs/clickhouse)

```typescript
import { createClient } from '@pkgs/@clickhouse/client'

const client = createClient({
    url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USER ?? 'default',
    password: process.env.CLICKHOUSE_PASSWORD ?? '',
})

const resultSet = await client.query({
    query: 'SELECT * FROM my_table',
    format: 'JSONEachRow',
})
const dataset = await resultSet.text()
logConsole(dataset)


```