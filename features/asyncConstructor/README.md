<!--- This asyncConstructor was auto-generated using "npx sky readme" --> 

# [Sky Docs](../../README.md)

[Overview](..%2F..%2Fdocs%2FREADME.md)   
[Packages](..%2F..%2F%40pkgs%2FREADME.md)   
[Platform](..%2F..%2F%40platform%2FREADME.md)   
[Camera](..%2F..%2F%5Fexamples%2Fcameras%2FSkyPerspectiveCamera%2Fdocs%2FREADME.md)   
[Test](..%2F..%2F%5Fexamples%2Fcameras%2FSkyPerspectiveCamera%2Ftest%2FREADME.md)   
[cameras](..%2F..%2Fcameras%2FREADME.md)   
[components](..%2F..%2Fcomponents%2FREADME.md)   
[Crypto](..%2F..%2Fcrypto%2FREADME.md)   
**[Features](..%2F..%2Ffeatures%2FREADME.md)**   
* **[asyncConstructor](..%2F..%2Ffeatures%2FasyncConstructor%2FREADME.md)**
* [Effect](..%2F..%2Ffeatures%2Feffect%2FREADME.md)
  
[Helpers](..%2F..%2Fhelpers%2FREADME.md)   
[Standard](..%2F..%2Fstandard%2FREADME.md)   

# [Features](..%2F..%2Ffeatures%2FREADME.md) / asyncConstructor

## asyncConstructor

[source code](%5FasyncConstructor.ts)

```typescript
import asyncConstructor from 'sky/features/asyncConstructor'

class Foo {
    constructor() {
        return asyncConstructor(async () => {
            await some()
            return this
        })
    }
}

const foo = await new Foo()

class Boo {
    constructor() {
        return asyncConstructor(async () => {
            await this
            await some()
            return this
        })
    }
}

const boo = await new Boo()

```

```typescript
// source code
//@ts-ignore
export default async function asyncConstructor<T>(fn: () => Promise<T>): T {
    return await fn()
}

```