<!--- This EventEmitter was auto-generated using "pnpm exec sky readme" --> 

# [Sky Modules Docs](../../README.md)

[Commands](..%2F..%2F%5Fcommands%2FREADME.md)   
[Standard](..%2F..%2Fstandard%2FREADME.md)   
[Platform](..%2F..%2Fplatform%2FREADME.md)   
**[Utilities](..%2F..%2Futilities%2FREADME.md)**   
* **[EventEmitter](..%2F..%2Futilities%2FEventEmitter%2FREADME.md)**
* [globalify](..%2F..%2Futilities%2Fglobalify%2FREADME.md)
* [idle](..%2F..%2Futilities%2Fidle%2FREADME.md)
* [PromisesPool](..%2F..%2Futilities%2FPromisesPool%2FREADME.md)
* [times](..%2F..%2Futilities%2Ftimes%2FREADME.md)
  
[Helpers](..%2F..%2Fhelpers%2FREADME.md)   
[Packages](..%2F..%2Fpkgs%2FREADME.md)   
[cameras](..%2F..%2Fcameras%2FREADME.md)   
[components](..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
[ECS Components](..%2F..%2Fecs%2FREADME.md)   
[Features](..%2F..%2Ffeatures%2FREADME.md)   

## [Utilities](..%2F..%2Futilities%2FREADME.md): EventEmitter [(Source)](..%2F..%2Futilities%2FEventEmitter%2F)

  
### Depends

standard   

### Examples

```ts
import 'sky/helpers/EventEmitter/global'

const eventEmitter = new EventEmitter()
const callback = () => console.log('test')
eventEmitter.on('test', callback)
eventEmitter.emit('test') // fire event
eventEmitter.off('test', callback)

```

Inheritance

```ts
import 'sky/helpers/EventEmitter/global'

class Test extends EventEmitter {}
const test = new Test()
const callback = () => console.log('test')
test.on('test', () => callback)
test.emit('test') // fire event
test.off('test', () => callback)

```

Extend

```ts
import 'sky/helpers/EventEmitter/global'

const test = EventEmitter.extend(() => {
    console.log('I am a function!')
})
const callback = () => console.log('test')
test.on('test', callback)
test.emit('test') // fire event
test.off('test', callback)

test()

```