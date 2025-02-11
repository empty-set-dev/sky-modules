<!--- This Math was auto-generated using "npx sky readme" --> 

# [Sky Docs](../../README.md)

[Commands](..%2F..%2F%5Fcommands%2FREADME.md)   
**[Standard](..%2F..%2Fstandard%2FREADME.md)**   
* [Array](..%2F..%2Fstandard%2FArray%2FREADME.md)
* [bind](..%2F..%2Fstandard%2Fbind%2FREADME.md)
* [fetch](..%2F..%2Fstandard%2Ffetch%2FREADME.md)
* **[Math](..%2F..%2Fstandard%2FMath%2FREADME.md)**
* [measures](..%2F..%2Fstandard%2Fmeasures%2FREADME.md)
* [Promise](..%2F..%2Fstandard%2FPromise%2FREADME.md)
  
[Helpers](..%2F..%2Fhelpers%2FREADME.md)   
[Cameras](..%2F..%2Fcameras%2FREADME.md)   
[Components](..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
[Features](..%2F..%2Ffeatures%2FREADME.md)   
[Packages](..%2F..%2Fpkgs%2FREADME.md)   
[Platform](..%2F..%2Fplatform%2FREADME.md)   

## [Standard](..%2F..%2Fstandard%2FREADME.md) / Math [(Source)](..%2F..%2Fstandard%2FMath%2F)

  
## Math.minmax

```typescript
const x = -9
Math.minmax(x, 0, 100) // 0

```

## Math.randomBetween(from: number, to: number): number

@param from: number - default 0  
@param to: number - default 1  
@returns — number

```typescript
Math.randomBetween(0, 10) // 0 - 10

```

## Math.roundedRandomBetween(from: number, to: number): number

@param from — number  
@param to — number  
@returns — number

```typescript
Math.roundedRandomBetween(0, 10) // rounded 0 - 10

```