<!--- This Effect was auto-generated using "npx sky readme" --> 

# [Sky Docs](../../README.md)

[Overview](..%2F..%2Fdocs%2FREADME.md)   
[Commands](..%2F..%2F%5Fcommands%2Fdocs%2FREADME.md)   
[cameras](..%2F..%2Fcameras%2FREADME.md)   
[components](..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
**[Features](..%2F..%2Ffeatures%2FREADME.md)**   
* [asyncConstructor](..%2F..%2Ffeatures%2FasyncConstructor%2FREADME.md)
* **[Effect](..%2F..%2Ffeatures%2Feffect%2FREADME.md)**
  
[Helpers](..%2F..%2Fhelpers%2FREADME.md)   
[Packages](..%2F..%2Fpkgs%2FREADME.md)   
[Platform](..%2F..%2Fplatform%2FREADME.md)   
[Standard.3](..%2F..%2Fstandard%2FREADME.md)   

## [Features](..%2F..%2Ffeatures%2FREADME.md) / Effect [(Source)](..%2F..%2Ffeatures%2Feffect%2F)

## Depends: [standard](../../standard/Standard.md)

## Root, Effect

```typescript
class App extends EffectsRoot {
    static context = true

    foo = 42

    constructor() {
        super()

        this.destroy = (): void => {
            console.log('app destroyed')
        }
    }
}

class Player extends Effect {
    constructor(deps: EffectDeps) {
        super(deps)

        new Timeout(
            () => {
                console.log('Player')
            },
            1000,
            [this, App]
        )

        this.destroy = (): void => {
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