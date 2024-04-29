<!--- This bind was auto-generated using "npx sky readme build" --> 

# [Sky Docs](/README.md)

[Features](../../features/Features.md)   
[Helpers](../../helpers/Helpers.md)   
[Standard](../../standard2/Standard.md)   
[Styles](../../styles/Styles.md)   

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
```../../docs/Header.js

```