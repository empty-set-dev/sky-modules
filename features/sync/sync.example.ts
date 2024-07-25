import './global'

class Foo {
    @sync
    x: number
}

class App extends Sync {
    static list = [Foo]

    @sync
    title: string
}

const foo = new Foo()
foo.x = 0

const app = new App()
