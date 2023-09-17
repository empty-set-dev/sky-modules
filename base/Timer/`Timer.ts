export default class Timer {
    constructor() {
        this.reset()
    }

    reset(): void {
        this['__time'] = Date.now()
    }

    time(): number {
        return Date.now() - this['__time']
    }

    private __time!: number
}
