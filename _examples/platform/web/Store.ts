import { makeAutoObservable } from 'mobx'

export default interface Store {
    counter: CounterStore
}

export class CounterStore {
    counter: number

    constructor() {
        makeAutoObservable(this)
        this.counter = 0
    }
}
