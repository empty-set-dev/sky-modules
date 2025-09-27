<!--- This ClickHouse Client Web was auto-generated using "pnpm exec sky readme" --> 

# [Sky Modules Docs](../../../README.md)

[Cli](..%2F..%2F..%2Fcli%2FREADME.md)   
[Standard](..%2F..%2F..%2Fcore%2FREADME.md)   
[Utilities](..%2F..%2F..%2Futilities%2FREADME.md)   
[Helpers](..%2F..%2F..%2Fhelpers%2FREADME.md)   
**[Packages](..%2F..%2F..%2Fpkgs%2FREADME.md)**   
* [Fresnel](..%2F..%2F..%2Fpkgs%2F%40artsy%2Ffresnel%2FREADME.md)
* [ClickHouse Client](..%2F..%2F..%2Fpkgs%2F%40clickhouse%2Fclient%2FREADME.md)
* **[ClickHouse Client Web](..%2F..%2F..%2Fpkgs%2F%40clickhouse%2Fclient-web%2FREADME.md)**
* [Argon 2](..%2F..%2F..%2Fpkgs%2Fargon2%2FREADME.md)
* [Dot Env](..%2F..%2F..%2Fpkgs%2Fdotenv%2FREADME.md)
* [Express](..%2F..%2F..%2Fpkgs%2Fexpress%2FREADME.md)
* [Express Http Proxy](..%2F..%2F..%2Fpkgs%2Fexpress-http-proxy%2FREADME.md)
* [Json Web Token](..%2F..%2F..%2Fpkgs%2Fjsonwebtoken%2FREADME.md)
* [Knex](..%2F..%2F..%2Fpkgs%2Fknex%2FREADME.md)
* [React](..%2F..%2F..%2Fpkgs%2Freact%2FREADME.md)
  
[Crypto](..%2F..%2F..%2Fcrypto%2FREADME.md)   
[ECS Components](..%2F..%2F..%2Fecs%2FREADME.md)   
[Features](..%2F..%2F..%2Ffeatures%2FREADME.md)   
[components](..%2F..%2F..%2Freact%2Fcomponents%2FREADME.md)   
[cameras](..%2F..%2F..%2FThree%2Fcameras%2FREADME.md)   

## [Packages](..%2F..%2F..%2Fpkgs%2FREADME.md): ClickHouse Client Web [(Source)](..%2F..%2F..%2Fpkgs%2F%40clickhouse%2Fclient-web%2F)

  
### [npm](https://www.npmjs.com/package/@clickhouse/client-web)

[example](../../../%5Fexamples/pkgs/clickhouse/client-web)

```ts
import { createClient } from 'pkgs/@clickhouse/client-web'

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
Console.log(dataset)

```