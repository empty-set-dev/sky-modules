<!--- This ClickHouse Client Node was auto-generated using "npx sky readme" --> 

# [Sky Docs](../../../README.md)

[Overview](..%2F..%2F..%2Fdocs%2FREADME.md)   
**[Packages](..%2F..%2F..%2F%40pkgs%2FREADME.md)**   
* [Fresnel](..%2F..%2F..%2F%40pkgs%2F%40artsy%2Ffresnel%2FREADME.md)
* **[ClickHouse Client Node](..%2F..%2F..%2F%40pkgs%2F%40clickhouse%2Fclient-node%2FREADME.md)**
* [ClickHouse Client Web](..%2F..%2F..%2F%40pkgs%2F%40clickhouse%2Fclient-web%2FREADME.md)
* [React Query](..%2F..%2F..%2F%40pkgs%2F%40tanstack%2Freact-query%2FREADME.md)
* [Argon 2](..%2F..%2F..%2F%40pkgs%2Fargon2%2FREADME.md)
* [Args](..%2F..%2F..%2F%40pkgs%2Fargs%2FREADME.md)
* [Express](..%2F..%2F..%2F%40pkgs%2Fexpress%2FREADME.md)
* [React](..%2F..%2F..%2F%40pkgs%2Freact%2FREADME.md)
  
[Platform](..%2F..%2F..%2F%40platform%2FREADME.md)   
[Camera](..%2F..%2F..%2F%5Fexamples%2Fcameras%2FSkyPerspectiveCamera%2Fdocs%2FREADME.md)   
[Test](..%2F..%2F..%2F%5Fexamples%2Fcameras%2FSkyPerspectiveCamera%2Ftest%2FREADME.md)   
[cameras](..%2F..%2F..%2Fcameras%2FREADME.md)   
[components](..%2F..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2F..%2Fcrypto%2FREADME.md)   
[Features](..%2F..%2F..%2Ffeatures%2FREADME.md)   
[Helpers](..%2F..%2F..%2Fhelpers%2FREADME.md)   
[Standard](..%2F..%2F..%2Fstandard%2FREADME.md)   

# [Packages](..%2F..%2F..%2F%40pkgs%2FREADME.md) / ClickHouse Client Node [(Source)](..%2F..%2F..%2F%40pkgs%2F%40clickhouse%2Fclient-node%2F)

## [npm](https://www.npmjs.com/package/@clickhouse/client)

[example](../../../%5Fexamples/@pkgs/clickhouse/client-node)

```typescript
import { createClient } from '@pkgs/@clickhouse/client-node'

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