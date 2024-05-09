<!--- This Math was auto-generated using "npx sky readme build" --> 

# [Sky Docs](/README.md)

[Platform: Node](..%2F..%2F%40node%2FPlatform%3A%20Node.md)   
[Components](..%2F..%2Fcomponents%2FComponents.md)   
[Features](..%2F..%2Ffeatures%2FFeatures.md)   
[Helpers](..%2F..%2Fhelpers%2FHelpers.md)   
**[Standard](..%2F..%2Fstandard%2FStandard.md)**   
* [Array](..%2F..%2Fstandard%2FArray%2FArray.md)
* **[Math](..%2F..%2Fstandard%2FMath%2FMath.md)**
* [Promise](..%2F..%2Fstandard%2FPromise%2FPromise.md)
* [bind](..%2F..%2Fstandard%2Fbind%2Fbind.md)
* [fetch](..%2F..%2Fstandard%2Ffetch%2Ffetch.md)
* [time](..%2F..%2Fstandard%2Ftime%2Ftime.md)
  
[Styles](..%2F..%2Fstyles%2FStyles.md)   

# [Standard](../../standard/Standard.md) / Math

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