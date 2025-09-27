# Math

<div class="sky-gradient-text" style="font-size: 1.2em; margin: 1em 0;">
  Math utility module
</div>


<!--- This Math was auto-generated using "pnpm exec sky readme" --> 

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
* **[Math](..%2F..%2Fcore%2FMath%2FREADME.md)**
* [measures](..%2F..%2Fcore%2Fmeasures%2FREADME.md)
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
import { Math } from '@sky-modules/core'
```

## [Standard](..%2F..%2Fcore%2FREADME.md): Math [(Source)](..%2F..%2Fcore%2FMath%2F)

  
### _function_ Math.minmax(value: number, min: number, max: number): number

```ts
const x = -9
Math.minmax(x, 0, 100) // 0

```

### _function_ Math.randomBetween(from: number, to: number): number

```ts
Math.randomBetween(0, 10) // 0 - 10

```

### _function_ Math.roundedRandomBetween(from: number, to: number): number

```ts
Math.roundedRandomBetween(0, 10) // rounded 0 - 10

```