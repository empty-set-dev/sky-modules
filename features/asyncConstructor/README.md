<!--- This asyncConstructor was auto-generated using "pnpm exec sky readme" --> 

# [Sky Modules Docs](../../README.md)

[Commands](..%2F..%2F%5Fcommands%2FREADME.md)   
[Standard](..%2F..%2Fstandard%2FREADME.md)   
[Platform](..%2F..%2Fplatform%2FREADME.md)   
[Utilities](..%2F..%2Futilities%2FREADME.md)   
[Helpers](..%2F..%2Fhelpers%2FREADME.md)   
[Packages](..%2F..%2Fpkgs%2FREADME.md)   
[cameras](..%2F..%2Fcameras%2FREADME.md)   
[components](..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
[ECS Components](..%2F..%2Fecs%2FREADME.md)   
**[Features](..%2F..%2Ffeatures%2FREADME.md)**   
* **[asyncConstructor](..%2F..%2Ffeatures%2FasyncConstructor%2FREADME.md)**
* [ECS](..%2F..%2Ffeatures%2Fecs%2FREADME.md)
* [Effect](..%2F..%2Ffeatures%2Feffect%2FREADME.md)
  
## [Features](..%2F..%2Ffeatures%2FREADME.md) / asyncConstructor [(Source)](..%2F..%2Ffeatures%2FasyncConstructor%2F)

  
### asyncConstructor

[source code](%5FasyncConstructor.ts)

```ts
import asyncConstructor from 'sky/features/asyncConstructor'

class Foo {
    constructor() {
        return asyncConstructor(this, Foo.asyncConstructor)
    }
    
    private static async asynConstructor() {}
}

const foo = await new Foo()

class Boo extends Foo {
    constructor() {
        return asyncConstructor(this, Boo.asyncConstructor2)
    }
    
    private static async asynConstructor2() {
        await some()
    }
}

const boo = await new Boo()

```