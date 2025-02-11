<!--- This PromisesPool was auto-generated using "npx sky readme" --> 

# [Sky Docs](../../README.md)

[Commands](..%2F..%2F%5Fcommands%2FREADME.md)   
[Standard](..%2F..%2Fstandard%2FREADME.md)   
**[Helpers](..%2F..%2Fhelpers%2FREADME.md)**   
* [EventEmitter](..%2F..%2Fhelpers%2FEventEmitter%2FREADME.md)
* [globalify](..%2F..%2Fhelpers%2Fglobalify%2FREADME.md)
* [idle](..%2F..%2Fhelpers%2Fidle%2FREADME.md)
* [Loop](..%2F..%2Fhelpers%2FLoop%2FREADME.md)
* **[PromisesPool](..%2F..%2Fhelpers%2FPromisesPool%2FREADME.md)**
* [times](..%2F..%2Fhelpers%2Ftimes%2FREADME.md)
  
[Cameras](..%2F..%2Fcameras%2FREADME.md)   
[Components](..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
[Features](..%2F..%2Ffeatures%2FREADME.md)   
[Packages](..%2F..%2Fpkgs%2FREADME.md)   
[Platform](..%2F..%2Fplatform%2FREADME.md)   

## [Helpers](..%2F..%2Fhelpers%2FREADME.md) / PromisesPool [(Source)](..%2F..%2Fhelpers%2FPromisesPool%2F)

  
## class PromisesPool

[source code](%5FPromisesPool.ts)

```ts
new PromisesPool(maxCount: number = 10)

```

### method PromisesPool.run

[source code](%5FPromisesPool+run.ts)

```ts
const pool: PromisesPool
pool.run<A extends unknown[]>(task: PromisesPool.Task<A>, ...args: A): Promise<void>

```

### method PromisesPool.wait

[source code](%5FPromisesPool+wait.ts)  
await all tasks

```ts
const pool: PromisesPool
await pool.wait()

```