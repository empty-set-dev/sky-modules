<!--- This measures was auto-generated using "npx sky readme" --> 

# [Sky Docs](../../README.md)

[Overview](..%2F..%2Fdocs%2FOverview.md)   
[Camera](..%2F..%2F-examples%2Fcameras%2FSkyPerspectiveCamera%2Fdocs%2FCamera.md)   
[Test](..%2F..%2F-examples%2Fcameras%2FSkyPerspectiveCamera%2Ftest%2FTest.md)   
[Packages](..%2F..%2F%40pkgs%2FPackages.md)   
[Platform](..%2F..%2F%40platform%2FPlatform.md)   
[cameras](..%2F..%2Fcameras%2Fcameras.md)   
[components](..%2F..%2Fcomponents%2Fcomponents.md)   
[Crypto](..%2F..%2Fcrypto%2FCrypto.md)   
[Features](..%2F..%2Ffeatures%2FFeatures.md)   
[Helpers](..%2F..%2Fhelpers%2FHelpers.md)   
**[Standard](..%2F..%2Fstandard%2FStandard.md)**   
* [Array](..%2F..%2Fstandard%2FArray%2FArray.md)
* [Math](..%2F..%2Fstandard%2FMath%2FMath.md)
* [Promise](..%2F..%2Fstandard%2FPromise%2FPromise.md)
* [bind](..%2F..%2Fstandard%2Fbind%2Fbind.md)
* [fetch](..%2F..%2Fstandard%2Ffetch%2Ffetch.md)
* **[measures](..%2F..%2Fstandard%2Fmeasures%2Fmeasures.md)**
  
# [Standard](..%2F..%2Fstandard%2FStandard.md) / measures

## measures

```typescript
import globalify from 'sky/helpers/globalify'

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
    function Weight(value: Weight | number, dimension: number): Weight
}

class WeightID {
    private WeightID!: void
}

globalify(
    measures('Weight', [
        ['nanogram', 0.000000001],
        ['milligram', 0.001],
        ['decigram', 0.1],
        ['gram', 1],
        ['kilogram', 1000],
        ['ton', 1000000],
    ])
)

```

## standard measures

### KilometersPerHour

### Length

nanometers - 0.000000001 meter   
millimeters - 0.001 meter   
decimeters - 0,1 meter   
meters - base  
kilometers - 1000 meters

### MetersPerSecond

### Percents

### PercentsPerMillisecond

### PercentsPerSecond

### Time

nanoseconds - 0.000000001 second   
milliseconds - 0.001 second   
deciseconds - 0.1 second   
seconds - base   
minutes - 60 seconds   
hours - 60 minutes   
days - 24 hours   
weeks - 7 days

### Weight

nanogram - 0.000000001 gram   
milligram - 0.001 gram   
decigram - 0.1 gram   
gram - base   
kilogram - 1000 gram   
ton 1000000 gram