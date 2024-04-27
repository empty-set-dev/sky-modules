<!--- This bind was auto-generated using "npx sky readme build" --> 

# [Sky Docs](/README.md)

[Features](../../features/Features.md)   
[Helpers](../../helpers/Helpers.md)   
**[Standard](../../standard/Standard.md)**   
* [Array](../../standard/Array/Array.md)
* [Math](../../standard/Math/Math.md)
* **[bind](../../standard/bind/bind.md)**
* [fetch](../../standard/fetch/fetch.md)
* [time](../../standard/time/time.md)
  
[Styles](../../styles/Styles.md)   

# [Standard](../../standard/Standard.md) / bind

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