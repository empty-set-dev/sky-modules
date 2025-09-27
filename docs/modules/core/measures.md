# measures

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  measures utility module
</div>


<!--- This measures was auto-generated using "pnpm exec sky readme" --> 

# [Sky Modules Docs](../../README.md)

[Cli](..%2F..%2Fcli%2FREADME.md)   
**[Standard](..%2F..%2Fcore%2FREADME.md)**   
* [Array](..%2F..%2Fcore%2FArray%2FREADME.md)
* [bind](..%2F..%2Fcore%2Fbind%2FREADME.md)
* [Class](..%2F..%2Fcore%2FClass%2FREADME.md)
* [EventEmitter](..%2F..%2Fcore%2FEventEmitter%2FREADME.md)
* [fetch](..%2F..%2Fcore%2Ffetch%2FREADME.md)
* [globalify](..%2F..%2Fcore%2Fglobalify%2FREADME.md)
* [globalify.ru](..%2F..%2Fcore%2Fglobalify%2FREADME.md)
* [idle](..%2F..%2Fcore%2Fidle%2FREADME.md)
* [Math](..%2F..%2Fcore%2FMath%2FREADME.md)
* **[measures](..%2F..%2Fcore%2Fmeasures%2FREADME.md)**
* [Object](..%2F..%2Fcore%2FObject%2FREADME.md)
* [Promise](..%2F..%2Fcore%2FPromise%2FREADME.md)
  
[Utilities](..%2F..%2Futilities%2FREADME.md)   
[Helpers](..%2F..%2Fhelpers%2FREADME.md)   
[Packages](..%2F..%2Fpkgs%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
[ECS Components](..%2F..%2Fecs%2FREADME.md)   
[Features](..%2F..%2Ffeatures%2FREADME.md)   
[components](..%2F..%2Freact%2Fcomponents%2FREADME.md)   
[cameras](..%2F..%2FThree%2Fcameras%2FREADME.md)   


## Installation

```bash
npm install @sky-modules/core
```

## Usage

```typescript
import { measures } from '@sky-modules/core'
```

## [Standard](..%2F..%2Fcore%2FREADME.md): measures [(Source)](..%2F..%2Fcore%2Fmeasures%2F)

  
### measures

```ts
declare global {
    interface Number {
        get asNanograms(): Weight
        get asMilligrams(): Weight
        get asDecigrams(): Weight
        get asGrams(): Weight
        get asKilograms(): Weight
        get asTons(): Weight
    }
    interface Weight extends Number, WeightID {
        get inNanograms(): number
        get inMilligrams(): number
        get inDecigrams(): number
        get inGrams(): number
        get inKilograms(): number
        get inTons(): number
    }
}

class WeightID {
    private WeightID = true
}

defineMeasures('Weight', [
    ['Nanograms', 0.000000001],
    ['Milligrams', 0.001],
    ['Decigrams', 0.1],
    ['Grams', 1],
    ['Kilograms', 1000],
    ['Tons', 1000000],
])

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