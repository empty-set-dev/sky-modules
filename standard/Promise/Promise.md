<!--- This Promise was auto-generated using "npx sky readme build" --> 

# [Sky Docs](/README.md)

[Features](../../features/Features.md)   
[Helpers](../../helpers/Helpers.md)   
**[Standard](../../standard/Standard.md)**   
* [Array](../../standard/Array/Array.md)
* [Math](../../standard/Math/Math.md)
* **[Promise](../../standard/Promise/Promise.md)**
* [bind](../../standard/bind/bind.md)
* [fetch](../../standard/fetch/fetch.md)
* [time](../../standard/time/time.md)
  
[Styles](../../styles/Styles.md)   

# [Standard](../../standard/Standard.md) / Promise

## function createPromise<R>(): \[resolve: resolve<R>, promise: Promise<R>\]

```typescript
const [resolve, promise] = createPromise<number>()

```

## Types

```typescript
Promise.Void
Promise.number // without type
Promise.Number
Promise.string // without type
Promise.String
Promise.Record<K, V>
Promise.Array<T>
Promise.Function
Promise.object // without type
Promise.Object

```