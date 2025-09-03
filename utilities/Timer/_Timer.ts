import Console from 'sky/standard/Console'

const timers: Record<string, boolean> = {}

export abstract class BaseOfTimer {
    static on(label: string): void {
        delete timers[label]
    }

    static off(label: string): void {
        timers[label] = false
    }

    protected _time: number = Date.now()
    protected _label: string

    constructor(label?: string) {
        this._label = label ?? ''
    }

    get label(): string {
        return this._label ?? ''
    }

    reset(): this {
        this._time = Date.now()
        return this
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
}

export default class Timer extends BaseOfTimer {
    deltaTime(): Time {
        const dt = Date.now() - this._time
        this._time += dt
        return dt.asMilliseconds
    }

    log(label?: string): void {
        if (!this.isOn(label)) {
            return
        }

        Console.log(
            `${this.label}${label ? `: ${label}` : ''}: ${this.deltaTime().inSeconds + 's'}`
        )
    }

    trace(label?: string): void {
        if (!this.isOn(label)) {
            return
        }

        Console.trace(this.label + label, this.deltaTime().inSeconds + 's')
    }
}

export class TimeoutTimer extends Timer {
    timeout(timeout: Time): boolean {
        const milliseconds = timeout.inMilliseconds

        if (Date.now() - this._time > milliseconds) {
            this._time += milliseconds
            return true
        }

        return false
    }
}

export class IntervalTimer extends Timer {
    private __isIntervalStarted: boolean = false

    interval(interval: Time, parameters?: Timer.IntervalParameters): boolean {
        if (!this.__isIntervalStarted) {
            this.__isIntervalStarted = true

            if (parameters && parameters.skipFirstTime) {
                return false
            }

            return true
        }

        const milliseconds = interval.inMilliseconds

        if (Date.now() - this._time > milliseconds) {
            this._time += milliseconds
            return true
        }

        return false
    }

    reset(): this {
        super.reset()
        this.__isIntervalStarted = false
        return this
    }
}

export class WaitTimer extends Timer {
    private __extra: number = 0

    constructor(label?: string, timer?: WaitTimer) {
        super(label)

        if (timer != null) {
            this.__extra = timer.__extra
        }
    }

    async wait(time: Time): Promise<void> {
        this.__updateExtra()
        this.__extra = Math.min(this.__extra, time.inMilliseconds)
        await idle((time.inMilliseconds - this.__extra).asMilliseconds)
        this.__extra -= time.inMilliseconds
    }

    private __updateExtra(): void {
        const newTime = Date.now()
        this.__extra += newTime - this._time
        this._time = newTime
    }
}

namespace Timer {
    export interface IntervalParameters {
        skipFirstTime?: boolean
    }
}
