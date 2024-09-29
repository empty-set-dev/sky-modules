<!--- This EventEmitter was auto-generated using "npx sky readme" --> 

# [Sky Docs](/README.md)

[Overview](..%2F..%2Fdocs%2Foverview%2FOverview.md)   
[cameras](..%2F..%2Fcameras%2Fcameras.md)   
[components](..%2F..%2Fcomponents%2Fcomponents.md)   
[Crypto](..%2F..%2Fcrypto%2FCrypto.md)   
[ECS Components](..%2F..%2Fecs-components%2FECS%20Components.md)   
[ECS Systems](..%2F..%2Fecs-systems%2FECS%20Systems.md)   
[Features](..%2F..%2Ffeatures%2FFeatures.md)   
**[Helpers](..%2F..%2Fhelpers%2FHelpers.md)**   
* **[EventEmitter](..%2F..%2Fhelpers%2FEventEmitter%2FEventEmitter.md)**
* [globalify](..%2F..%2Fhelpers%2Fglobalify%2Fglobalify.md)
* [idle](..%2F..%2Fhelpers%2Fidle%2Fidle.md)
* [Loop](..%2F..%2Fhelpers%2FLoop%2FLoop.md)
* [PromisesPool](..%2F..%2Fhelpers%2FPromisesPool%2FPromisesPool.md)
* [times](..%2F..%2Fhelpers%2Ftimes%2Ftimes.md)
  
[Packages](..%2F..%2F%40pkgs%2FPackages.md)   
[Platform: Node](..%2F..%2F%40node%2FPlatform%3A%20Node.md)   
[Platform: Web](..%2F..%2F%40web%2FPlatform%3A%20Web.md)   
[Standard](..%2F..%2Fstandard%2FStandard.md)   

# [Helpers](..%2F..%2Fhelpers%2FHelpers.md) / EventEmitter

## Depends

standard   

## Examples

```typescript
import 'helpers/EventEmitter/global'

const eventEmitter = new EventEmitter()
const dispose = eventEmitter.on('test', () => console.log('test'))
eventEmitter.emit('test') // fire event
dispose()

```

Inheritance

```typescript
import 'helpers/EventEmitter/global'

class Test extends EventEmitter {}
const test = new Test()
const dispose = test.on('test', () => console.log('test'))
test.emit('test') // fire event
dispose()

```

Extend

```typescript
import 'helpers/EventEmitter/global'

const test = EventEmitter.extend(() => {
    console.log('I am a function!')
})
const dispose = test.on('test', () => console.log('test'))
test.emit('test') // fire event
dispose()

test()

```