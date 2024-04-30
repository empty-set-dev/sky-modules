<!--- This Loop was auto-generated using "npx sky readme build" --> 

# [Sky Docs](/README.md)

[Features](../../features/Features.md)   
**[Helpers](../../helpers/Helpers.md)**   
* [EventEmitter](../../helpers/EventEmitter/EventEmitter.md)
* [Loop](../../helpers/Loop/Loop.md)
* [Timer](../../helpers/Timer/Timer.md)
* [globalify](../../helpers/globalify/globalify.md)
* **[idle](../../helpers/idle/idle.md)**
* [times](../../helpers/times/times.md)
  
[Standard](../../standard/Standard.md)   
[Styles](../../styles/Styles.md)   

# [Helpers](../../helpers/Helpers.md) / idle

## Loop extends Effect

```typescript
new Loop(time(1, seconds), time(1, seconds), dt => {
    console.log('dt', dt)
}, [root])

```