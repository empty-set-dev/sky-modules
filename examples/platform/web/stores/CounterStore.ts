import { action, makeObservable, observable } from 'mobx'

export class CounterStore {
    @observable
    count = 0

    constructor() {
        makeObservable(this)
        this.count = 10
    }

    @action
    setCount(count: number): void {
        this.count = count
    }
}
