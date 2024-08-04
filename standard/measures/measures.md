<!--- This measures was auto-generated using "npx sky readme" --> 

# [Sky Docs](/README.md)

[Overview](..%2F..%2Fdocs%2Foverview%2FOverview.md)   
[Platform: Node](..%2F..%2F%40node%2FPlatform%3A%20Node.md)   
[Platform: Web](..%2F..%2F%40web%2FPlatform%3A%20Web.md)   
[Ables](..%2F..%2Fables%2FAbles.md)   
[cameras](..%2F..%2Fcameras%2Fcameras.md)   
[components](..%2F..%2Fcomponents%2Fcomponents.md)   
[Crypto](..%2F..%2Fcrypto%2FCrypto.md)   
[Features](..%2F..%2Ffeatures%2FFeatures.md)   
[Helpers](..%2F..%2Fhelpers%2FHelpers.md)   
**[Standard](..%2F..%2Fstandard%2FStandard.md)**   
* [Array](..%2F..%2Fstandard%2FArray%2FArray.md)
* [Length](..%2F..%2Fstandard%2FLength%2FLength.md)
* [Math](..%2F..%2Fstandard%2FMath%2FMath.md)
* [Promise](..%2F..%2Fstandard%2FPromise%2FPromise.md)
* [bind](..%2F..%2Fstandard%2Fbind%2Fbind.md)
* [fetch](..%2F..%2Fstandard%2Ffetch%2Ffetch.md)
* **[measures](..%2F..%2Fstandard%2Fmeasures%2Fmeasures.md)**
  
# [Standard](..%2F..%2Fstandard%2FStandard.md) / measures

## measures

```typescript
declare global {
    const nanogram: number
    const milligram: number
    const decigram: number
    const gram: number
    const kilogram: number
    const ton: number

    interface Weight extends Number, WeightID {
        get nanogram(): number
        get milligram(): number
        get decigram(): number
        get gram(): number
        get kilogram(): number
        get ton(): number
    }
    function Weight(value: Weight | number, dimension?: number): Weight
}

class WeightID {
    private WeightID: void
}

globalify(
    measures('Weight', [
        ['nanogram', 0.000000001],
        ['milligram', 1000000],
        ['decigram', 100],
        ['gram', 10],
        ['kilogram', 1000],
        ['ton', 1000],
    ])
)

```

## standard measures

* KilometersPerHour
* MetersPerSecond
* Percents
* PercentsPerMillisecond
* PercentsPerSecond
* Time
* Weight