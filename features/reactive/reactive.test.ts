import reactive from '.'

class Test {
    @reactive
    get x(): number {
        return this.y * 5
    }

    @reactive
    y = 5

    foo() {}

    static x = 5
}

class Test2 {
    test = new Test()

    @reactive
    get x(): number {
        return this.test.x * 5
    }
}

const test2 = new Test2()
test2.test.y = reactive(() => 42)
console.log(test2.test)
