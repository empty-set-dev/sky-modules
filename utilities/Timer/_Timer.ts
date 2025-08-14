import Console from 'sky/utilities/Console'

const timers: Record<string, boolean> = {}

export default class Timer {
    static on(label: string): void {
        delete timers[label]
    }

    static off(label: string): void {
        timers[label] = false
    }

    constructor(label?: string) {
        this['__label'] = label ?? ''
    }

    get label(): string {
        return this['__label'] ?? ''
    }

    init(): this {
        this['__time'] = Date.now()
        return this
    }

    reset(): void {
        delete this['__time']
    }

    deltaTime(): Time {
        if (this['__time'] == null) {
            this.init()
            return Time(0)
        }

        const dt = Date.now() - this['__time']
        this['__time'] += dt
        return Time(dt, milliseconds)
    }

    interval(interval: Time, parameters: Timer.IntervalParameters = {}): boolean {
        if (this['__time'] == null) {
            this.init()

            if (parameters.skipFirstTime) {
                return false
            }

            return true
        }

        const milliseconds = interval.milliseconds

        if (Date.now() - this['__time'] > milliseconds) {
            this['__time'] += milliseconds
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

    private ['__label']: string
    private ['__time']?: number
}

namespace Timer {
    export interface IntervalParameters {
        skipFirstTime?: boolean
    }
}
