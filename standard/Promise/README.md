<!--- This Promise was auto-generated using "npx sky readme" --> 

# [Sky Docs](../../README.md)

[Overview](..%2F..%2Fdocs%2FREADME.md)   
[Packages](..%2F..%2F%40pkgs%2FREADME.md)   
[Platform](..%2F..%2F%40platform%2FREADME.md)   
[cameras](..%2F..%2Fcameras%2FREADME.md)   
[components](..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
[Features](..%2F..%2Ffeatures%2FREADME.md)   
[Helpers](..%2F..%2Fhelpers%2FREADME.md)   
**[Standard](..%2F..%2Fstandard%2FREADME.md)**   
* [Array](..%2F..%2Fstandard%2FArray%2FREADME.md)
* [Math](..%2F..%2Fstandard%2FMath%2FREADME.md)
* **[Promise](..%2F..%2Fstandard%2FPromise%2FREADME.md)**
* [bind](..%2F..%2Fstandard%2Fbind%2FREADME.md)
* [fetch](..%2F..%2Fstandard%2Ffetch%2FREADME.md)
* [measures](..%2F..%2Fstandard%2Fmeasures%2FREADME.md)
  
# [Standard](..%2F..%2Fstandard%2FREADME.md) / Promise [(Source)](..%2F..%2Fstandard%2FPromise%2F)

## function Promise.create<R>(): \[resolve: resolve<R>, promise: Promise<R>\]

```typescript
const [resolve, promise] = createPromise<number>()

```