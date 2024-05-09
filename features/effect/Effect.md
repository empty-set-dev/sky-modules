<!--- This Effect was auto-generated using "npx sky readme build" --> 

# [ Docs](/README.md)

[Platform: Node](..%2F..%2F%40node%2FPlatform%3A%20Node.md)   
[Components](..%2F..%2Fcomponents%2FComponents.md)   
**[Features](..%2F..%2Ffeatures%2FFeatures.md)**   
* [ECS](..%2F..%2Ffeatures%2Fecs%2FECS.md)
* [Effect](..%2F..%2Ffeatures%2Feffect%2FEffect.md)
  
[Helpers](..%2F..%2Fhelpers%2FHelpers.md)   
[Standard](..%2F..%2Fstandard%2FStandard.md)   
[Styles](..%2F..%2Fstyles%2FStyles.md)   

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

## TODO