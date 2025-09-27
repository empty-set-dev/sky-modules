export class CounterStore {
    count = 0

    constructor() {
        this.count = 10
    }

    setCount(count: number): void {
        this.count = count
    }
}
