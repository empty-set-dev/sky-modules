import Console from 'sky/utilities/Console'

const timers: Record<string, boolean> = {}

export default class Timer {
    static on(label: string): void {
        delete timers[label]
    }

    static off(label: string): void {
        timers[label] = false
    }

    private __label: string
    private __time: number = Date.now()
    private __isIntervalStarted: boolean = false
    private __extra: number = 0

    constructor(label?: string) {
        this.__label = label ?? ''
    }

    get label(): string {
        return this.__label ?? ''
    }

    reset(): this {
        this.__time = Date.now()
        this.__isIntervalStarted = false
        return this
    }

    async wait(time: Time): Promise<void> {
        await idle(Time(time.valueOf() - this.__extra / 1000))
        const newTime = Date.now()
        this.__extra += newTime - this.__time - time.milliseconds
        this.__time = newTime
    }

    deltaTime(): Time {
        const dt = Date.now() - this.__time
        this.__time += dt
        return Time(dt, milliseconds)
    }

    timeout(timeout: Time): boolean {
        const milliseconds = timeout.milliseconds

        if (Date.now() - this.__time > milliseconds) {
            this.__time += milliseconds
            return true
        }

        return false
    }

    interval(interval: Time, parameters?: Timer.IntervalParameters): boolean {
        if (!this.__isIntervalStarted) {
            this.__isIntervalStarted = true

            if (parameters && parameters.skipFirstTime) {
                return false
            }

            return true
        }

        const milliseconds = interval.milliseconds

        if (Date.now() - this.__time > milliseconds) {
            this.__time += milliseconds
            return true
        }

        return false
    }

    isOn(label?: string): boolean {
        if (!label) {
            return timers[this.label] !== false
        }

        const parts = label.split(':')
        let partLabel = this.label

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i]
            partLabel += `: ${part}`

            if (timers[partLabel] === false) {
                return false
            }
        }

        return true
    }

    log(label?: string): void {
        if (!this.isOn(label)) {
            return
        }

        Console.log(`${this.label}${label ? `: ${label}` : ''}: ${this.deltaTime().seconds + 's'}`)
    }

    trace(label?: string): void {
        if (!this.isOn(label)) {
            return
        }

        Console.trace(this.label + label, this.deltaTime().seconds + 's')
    }
}

namespace Timer {
    export interface IntervalParameters {
        skipFirstTime?: boolean
    }
}
