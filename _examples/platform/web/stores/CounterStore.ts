import { makeAutoObservable } from 'mobx'

export class CounterStore {
    counter: number

    constructor() {
        makeAutoObservable(this)
        this.counter = 0
    }

    @bind
    setCounter(counter: number): void {
        this.counter = counter
    }
}
