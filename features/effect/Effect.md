<!--- This Effect was auto-generated using "npx sky readme" --> 

# [Sky Docs](/README.md)

[Overview](..%2F..%2Fdocs%2Foverview%2FOverview.md)   
[Platform: Browser](..%2F..%2F%40browser%2FPlatform%3A%20Browser.md)   
[Platform: Node](..%2F..%2F%40node%2FPlatform%3A%20Node.md)   
[Ables](..%2F..%2Fables%2FAbles.md)   
**[Features](..%2F..%2Ffeatures%2FFeatures.md)**   
* **[Effect](..%2F..%2Ffeatures%2Feffect%2FEffect.md)**
  
[Helpers](..%2F..%2Fhelpers%2FHelpers.md)   
[Standard](..%2F..%2Fstandard%2FStandard.md)   

# [Features](..%2F..%2Ffeatures%2FFeatures.md) / Effect

## Depends

standard  

## Root, Effect

```typescript
class App extends Root {
    static context = 'AppContext'

    foo = 42

    constructor() {
        super()

        this.destroy = (): void => {
            // eslint-disable-next-line no-console
            console.log('app destroyed')
        }
    }
}

class Player extends Effect {
    constructor(deps: EffectDeps) {
        super(deps)

        new Timeout(
            () => {
                // eslint-disable-next-line no-console
                console.log('Player')
            },
            1000,
            [this, App]
        )

        this.destroy = (): void => {
            // eslint-disable-next-line no-console
            console.log('player destroyed')
        }
    }
}

const app = new App()
new Player(app)

```

## Standard Effects

### Timeout

```typescript
new Timeout(() => console.log('Timeout!'), 100, [effect, Context])

```

### Interval

```typescript
new Interval(() => console.log('Interval!'), 100, [effect, Context])

```

### AnimationFrame

```typescript
new AnimationFrame(() => console.log('AnimationFrame!'), [effect, Context])

```

### AnimationFrames

```typescript
new AnimationFrames(() => console.log('AnimationFrame!'), [effect, Context])

```

### WindowEventListener

```typescript
new WindowEventListener('mousedown', ev => console.log(ev), [effect, Context], { once: true })

```

### DocumentEventListener

```typescript
new DocumentEventListener('pointerlockchange', ev => console.log(ev), [effect, Context], { once: true })

```

### PointerLock

```typescript
new PointerLock([effect, Context])

```

### Fullscreen

```typescript
new Fullscreen([effect, Context])

```