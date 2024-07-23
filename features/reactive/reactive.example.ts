import '.'

class Foo {
    @reactive
    x: number = reactive(
        () => {
            this.y
        },
        () => this.y * this.y
    )

    @reactive
    y: number = 0
}

const foo = new Foo()

foo.y = 10

// eslint-disable-next-line no-console
console.log(foo.x)
