import foo from './foo'

declare global {
    foo(Foo, {
        y: 42,
    })
}
