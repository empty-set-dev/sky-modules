<!--- This Promise was auto-generated using "npx sky readme" --> 

# [Sky Docs](/README.md)

[Overview](..%2F..%2Fdocs%2Foverview%2FOverview.md)   
[Platform: Node](..%2F..%2F%40node%2FPlatform%3A%20Node.md)   
[Platform: Web](..%2F..%2F%40web%2FPlatform%3A%20Web.md)   
[Ables](..%2F..%2Fables%2FAbles.md)   
[Features](..%2F..%2Ffeatures%2FFeatures.md)   
[Helpers](..%2F..%2Fhelpers%2FHelpers.md)   
**[Standard](..%2F..%2Fstandard%2FStandard.md)**   
* [Array](..%2F..%2Fstandard%2FArray%2FArray.md)
* [Length](..%2F..%2Fstandard%2FLength%2FLength.md)
* [Math](..%2F..%2Fstandard%2FMath%2FMath.md)
* **[Promise](..%2F..%2Fstandard%2FPromise%2FPromise.md)**
* [Time](..%2F..%2Fstandard%2FTime%2FTime.md)
* [bind](..%2F..%2Fstandard%2Fbind%2Fbind.md)
* [fetch](..%2F..%2Fstandard%2Ffetch%2Ffetch.md)
  
# [Standard](..%2F..%2Fstandard%2FStandard.md) / Promise

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