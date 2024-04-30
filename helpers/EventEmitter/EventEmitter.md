<!--- This EventEmitter was auto-generated using "npx sky readme build" --> 

# [Sky Docs](/README.md)

[Features](../../features/Features.md)   
**[Helpers](../../helpers/Helpers.md)**   
* **[EventEmitter](../../helpers/EventEmitter/EventEmitter.md)**
* [Loop](../../helpers/Loop/Loop.md)
* [Timer](../../helpers/Timer/Timer.md)
* [globalify](../../helpers/globalify/globalify.md)
* [idle](../../helpers/idle/idle.md)
* [times](../../helpers/times/times.md)
  
[Standard](../../standard/Standard.md)   
[Styles](../../styles/Styles.md)   

# [Helpers](../../helpers/Helpers.md) / EventEmitter

## Depends

standard   

## Examples

```typescript
import 'utilities/EventEmitter/global'

const eventEmitter = new EventEmitter()
const dispose = eventEmitter.on('test', () => console.log('test'))
eventEmitter.emit('test') // fire event
dispose()

```

Inheritance

```typescript
import 'utilities/EventEmitter/global'

class Test extends EventEmitter {}
const test = new Test()
const dispose = test.on('test', () => console.log('test'))
test.emit('test') // fire event
dispose()

```

Extend

```typescript
import 'utilities/EventEmitter/global'

const test = EventEmitter.extend(() => {
    console.log('I am a function!')
})
const dispose = test.on('test', () => console.log('test'))
test.emit('test') // fire event
dispose()

test()

```