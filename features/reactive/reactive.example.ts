import './global'

class Foo {
    @reactive
    x: number = reactive(
        () => {
            this.y
            this.z
        },
        () => this.y * this.z
    )

    @reactive
    y: number = 1

    @reactive
    z: number = 1
}

const foo = new Foo()

foo.y = 10
foo.z = 10

// eslint-disable-next-line no-console
console.log(foo.x)
