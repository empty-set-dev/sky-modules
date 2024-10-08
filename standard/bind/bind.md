<!--- This bind was auto-generated using "npx sky readme" --> 

# [Sky Docs](../../README.md)

[Overview](..%2F..%2Fdocs%2FOverview.md)   
[Camera](..%2F..%2F-examples%2Fcameras%2FSkyPerspectiveCamera%2Fdocs%2FCamera.md)   
[Test](..%2F..%2F-examples%2Fcameras%2FSkyPerspectiveCamera%2Ftest%2FTest.md)   
[Packages](..%2F..%2F%40pkgs%2FPackages.md)   
[Platform](..%2F..%2F%40platform%2FPlatform.md)   
[cameras](..%2F..%2Fcameras%2Fcameras.md)   
[components](..%2F..%2Fcomponents%2Fcomponents.md)   
[Crypto](..%2F..%2Fcrypto%2FCrypto.md)   
[Features](..%2F..%2Ffeatures%2FFeatures.md)   
[Helpers](..%2F..%2Fhelpers%2FHelpers.md)   
**[Standard](..%2F..%2Fstandard%2FStandard.md)**   
* [Array](..%2F..%2Fstandard%2FArray%2FArray.md)
* [Math](..%2F..%2Fstandard%2FMath%2FMath.md)
* [Promise](..%2F..%2Fstandard%2FPromise%2FPromise.md)
* **[bind](..%2F..%2Fstandard%2Fbind%2Fbind.md)**
* [fetch](..%2F..%2Fstandard%2Ffetch%2Ffetch.md)
* [measures](..%2F..%2Fstandard%2Fmeasures%2Fmeasures.md)
  
# [Standard](..%2F..%2Fstandard%2FStandard.md) / bind

```typescript
class Foo {
    x = 42

    @bind
    foo() {
        console.log(this.x)
    }
}

const foo = new Foo()
const foofoo = foo.foo
foofoo() // 42

```