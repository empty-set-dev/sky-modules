<!--- This Effect was auto-generated using "npx sky readme build" --> 

# [Sky Docs](/README.md)

**[Features](../../features/Features.md)**   
* [ECS](../../features/ecs/ECS.md)
* [Effect](../../features/effect/Effect.md)
  
[Helpers](../../helpers/Helpers.md)   
[Standard](../../standard/Standard.md)   
[Styles](../../styles/Styles.md)   

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
new Timeout(() => console.log('Timeout!'), 100, [link, Context])

```

### Interval

```typescript
new Interval(() => console.log('Interval!'), 100, [link, Context])

```

### AnimationFrame

```typescript
new AnimationFrame(() => console.log('AnimationFrame!'), [link, Context])

```

## TODO../../docs/Header.js