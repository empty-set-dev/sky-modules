<!--- This Effect was auto-generated using "pnpm exec sky readme" --> 

# [Sky Modules Docs](../../README.md)

[Commands](..%2F..%2Fcommands%2FREADME.md)   
[Standard](..%2F..%2Fstandard%2FREADME.md)   
[Platform](..%2F..%2Fplatform%2FREADME.md)   
[Utilities](..%2F..%2Futilities%2FREADME.md)   
[Helpers](..%2F..%2Fhelpers%2FREADME.md)   
[Packages](..%2F..%2Fpkgs%2FREADME.md)   
[cameras](..%2F..%2Fcameras%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
[ECS Components](..%2F..%2Fecs%2FREADME.md)   
**[Features](..%2F..%2Ffeatures%2FREADME.md)**   
* [ECS](..%2F..%2Ffeatures%2Fecs%2FREADME.md)
* **[Effect](..%2F..%2Ffeatures%2Feffect%2FREADME.md)**
  
[components](..%2F..%2Freact%2Fcomponents%2FREADME.md)   

## [Features](..%2F..%2Ffeatures%2FREADME.md): Effect [(Source)](..%2F..%2Ffeatures%2Feffect%2F)

  
### Depends: [standard](../../standard/Standard.md)

### Root, Effect

```ts
class App {
    static context = true

    readonly root: EffectsRoot

    foo = 42

    constructor() {
        this.root = new EffectsRoot()

        this.destroy = (): void => {
            console.log('app destroyed')
        }
    }
}

class Player {
    readonly effect: Effect

    constructor(deps: EffectDeps) {
        this.effect = new Effect(deps)

        new Timeout(
            () => {
                console.log('Player')
            },
            1000,
            [this.effect, App]
        )

        this.effect.destroy = (): void => {
            console.log('player destroyed')
        }
    }
}

const app = new App()
new Player(app)

```

### Standard Effects

#### Timeout

```ts
new Timeout(() => console.log('Timeout!'), 100, [effect, Context])

```

#### Interval

```ts
new Interval(() => console.log('Interval!'), 100, [effect, Context])

```

#### AnimationFrame

```ts
new AnimationFrame(() => console.log('AnimationFrame!'), [effect, Context])

```

#### AnimationFrames

```ts
new AnimationFrames(() => console.log('AnimationFrame!'), [effect, Context])

```

#### WindowEventListener

```ts
new WindowEventListener('mousedown', ev => console.log(ev), [effect, Context], { once: true })

```

#### DocumentEventListener

```ts
new DocumentEventListener('pointerlockchange', ev => console.log(ev), [effect, Context], { once: true })

```

#### PointerLock

```ts
new PointerLock([effect, Context])

```

#### Fullscreen

```ts
new Fullscreen([effect, Context])

```