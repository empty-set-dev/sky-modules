<!--- This measures was auto-generated using "pnpm exec sky readme" --> 

# [Sky Modules Docs](../../README.md)

[Commands](..%2F..%2F%5Fcommands%2FREADME.md)   
**[Standard](..%2F..%2Fstandard%2FREADME.md)**   
* [Array](..%2F..%2Fstandard%2FArray%2FREADME.md)
* [bind](..%2F..%2Fstandard%2Fbind%2FREADME.md)
* [Class](..%2F..%2Fstandard%2FClass%2FREADME.md)
* [fetch](..%2F..%2Fstandard%2Ffetch%2FREADME.md)
* [Math](..%2F..%2Fstandard%2FMath%2FREADME.md)
* **[measures](..%2F..%2Fstandard%2Fmeasures%2FREADME.md)**
* [Object](..%2F..%2Fstandard%2FObject%2FREADME.md)
* [Promise](..%2F..%2Fstandard%2FPromise%2FREADME.md)
  
[Platform](..%2F..%2Fplatform%2FREADME.md)   
[Utilities](..%2F..%2Futilities%2FREADME.md)   
[Helpers](..%2F..%2Fhelpers%2FREADME.md)   
[Packages](..%2F..%2Fpkgs%2FREADME.md)   
[cameras](..%2F..%2Fcameras%2FREADME.md)   
[components](..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
[Features](..%2F..%2Ffeatures%2FREADME.md)   

## [Standard](..%2F..%2Fstandard%2FREADME.md) / measures [(Source)](..%2F..%2Fstandard%2Fmeasures%2F)

  
### measures

```ts
import globalify from 'sky/utilities/globalify'

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

### standard measures

#### KilometersPerHour

#### Length

nanometers - 0.000000001 meter   
millimeters - 0.001 meter   
decimeters - 0,1 meter   
meters - base  
kilometers - 1000 meters

#### MetersPerSecond

#### Percents

#### PercentsPerMillisecond

#### PercentsPerSecond

#### Time

nanoseconds - 0.000000001 second   
milliseconds - 0.001 second   
deciseconds - 0.1 second   
seconds - base   
minutes - 60 seconds   
hours - 60 minutes   
days - 24 hours   
weeks - 7 days

#### Weight

nanogram - 0.000000001 gram   
milligram - 0.001 gram   
decigram - 0.1 gram   
gram - base   
kilogram - 1000 gram   
ton 1000000 gram