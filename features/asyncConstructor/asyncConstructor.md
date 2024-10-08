<!--- This asyncConstructor was auto-generated using "npx sky readme" --> 

# [Sky Docs](../../README.md)

[Overview](..%2F..%2Fdocs%2FOverview.md)   
[Packages](..%2F..%2F%40pkgs%2FPackages.md)   
[Platform](..%2F..%2F%40platform%2FPlatform.md)   
[Camera](..%2F..%2F%5Fexamples%2Fcameras%2FSkyPerspectiveCamera%2Fdocs%2FCamera.md)   
[Test](..%2F..%2F%5Fexamples%2Fcameras%2FSkyPerspectiveCamera%2Ftest%2FTest.md)   
[cameras](..%2F..%2Fcameras%2Fcameras.md)   
[components](..%2F..%2Fcomponents%2Fcomponents.md)   
[Crypto](..%2F..%2Fcrypto%2FCrypto.md)   
**[Features](..%2F..%2Ffeatures%2FFeatures.md)**   
* **[asyncConstructor](..%2F..%2Ffeatures%2FasyncConstructor%2FasyncConstructor.md)**
* [Effect](..%2F..%2Ffeatures%2Feffect%2FEffect.md)
  
[Helpers](..%2F..%2Fhelpers%2FHelpers.md)   
[Standard](..%2F..%2Fstandard%2FStandard.md)   

# [Features](..%2F..%2Ffeatures%2FFeatures.md) / asyncConstructor

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