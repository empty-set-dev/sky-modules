function use(...args: unknown[]): void {
    return
}

class AComponent {
    static component: 'a'
}
class BComponent {
    static component: 'a'
}

class Some extends composes(AComponent) {
    @use a: AComponent
    @use b: BComponent

    constructor() {
        super()

        this.b = new BComponent()
    }
}

const some = new Some()
