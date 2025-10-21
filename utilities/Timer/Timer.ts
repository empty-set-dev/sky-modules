import Console from '@sky-modules/core/Console'
import idle from '@sky-modules/core/idle'

const timersAllow: Record<string, boolean> = {}

/**
 * Base class for all timer implementations providing common functionality
 * for time tracking, labeling, and enable/disable controls.
 */
export abstract class TimerBase {
    /**
     * Enables timer with the specified label by removing it from the disabled list.
     * @param label - Timer label to enable
     */
    static on(label: string): void {
        delete timersAllow[label]
    }

    /**
     * Disables timer with the specified label.
     * @param label - Timer label to disable
     */
    static off(label: string): void {
        timersAllow[label] = false
    }

    protected _time: number = Date.now()
    protected _label: string

    /**
     * Creates a new timer instance.
     * @param label - Optional label for the timer
     */
    constructor(label?: string) {
        this._label = label ?? ''
    }

    /**
     * Gets the timer label.
     */
    get label(): string {
        return this._label ?? ''
    }

    /**
     * Resets the timer to the current time.
     * @returns This timer instance for chaining
     */
    reset(): this {
        this._time = Date.now()
        return this
    }

    /**
     * Checks if the timer is enabled for the given label.
     * Supports hierarchical labels separated by colons.
     * @param label - Optional label to check, uses timer's own label if not provided
     * @returns True if the timer is enabled
     */
    isOn(label?: string): boolean {
        if (!label) {
            return timersAllow[this.label] !== false
        }

        const parts = label.split(':')
        let partLabel = this.label

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i]
            partLabel += `: ${part}`

            if (timersAllow[partLabel] === false) {
                return false
            }
        }

        return true
    }
}

/**
 * Basic timer for measuring time intervals and logging performance.
 */
export default class Timer extends TimerBase {
    /**
     * Gets the time elapsed since the last call to deltaTime() or timer creation.
     * Updates the internal timer to the current time.
     * @returns Time object representing the elapsed time
     */
    deltaTime(): Time {
        const dt = Date.now() - this._time
        this._time += dt
        return dt.milliseconds
    }

    /**
     * Logs the elapsed time with an optional label.
     * Only logs if the timer is enabled for the given label.
     * @param label - Optional label to append to the timer's label
     */
    log(label?: string): void {
        if (!this.isOn(label)) {
            return
        }

        Console.log(
            `${this.label}${label ? `: ${label}` : ''}: ${this.deltaTime().inSeconds + 's'}`
        )
    }

    /**
     * Traces the elapsed time with an optional label using console.trace.
     * Only traces if the timer is enabled for the given label.
     * @param label - Optional label to append to the timer's label
     */
    trace(label?: string): void {
        if (!this.isOn(label)) {
            return
        }

        Console.trace(
            `${this.label}${label ? `: ${label}` : ''}: ${this.deltaTime().inSeconds + 's'}`
        )
    }
}

/**
 * Timer that checks if a specified timeout period has elapsed.
 */
export class TimeoutTimer extends Timer {
    /**
     * Checks if the specified timeout period has elapsed.
     * If timeout has passed, advances the internal timer by the timeout amount.
     * @param timeout - The timeout period to check
     * @returns True if the timeout period has elapsed
     */
    timeout(timeout: Time): boolean {
        const milliseconds = timeout.inMilliseconds

        if (Date.now() - this._time > milliseconds) {
            this._time += milliseconds
            return true
        }

        return false
    }
}

/**
 * Timer that fires at regular intervals.
 */
export class IntervalTimer extends Timer {
    private __isIntervalStarted: boolean = false

    /**
     * Checks if the specified interval has elapsed and manages interval timing.
     * On first call, can optionally skip the initial trigger.
     * @param interval - The interval period to check
     * @param parameters - Optional parameters for interval behavior
     * @returns True if the interval has elapsed and should fire
     */
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

    /**
     * Resets the timer and clears the interval started flag.
     * @returns This timer instance for chaining
     */
    reset(): this {
        super.reset()
        this.__isIntervalStarted = false
        return this
    }
}

/**
 * Timer that provides precise waiting with time compensation for execution delays.
 * Tracks extra time spent in execution and compensates for it in subsequent waits.
 */
export class WaitTimer extends Timer {
    private __extraMs: number = 0

    /**
     * Creates a new WaitTimer instance.
     * @param label - Optional label for the timer
     * @param timer - Optional existing WaitTimer to copy extra time compensation from
     */
    constructor(label?: string, timer?: WaitTimer) {
        super(label)

        if (timer != null) {
            this.__extraMs = timer.__extraMs
        }
    }

    /**
     * Waits for the specified time with compensation for execution delays.
     * Automatically adjusts wait time based on previously accumulated extra time.
     * @param time - The time to wait
     */
    async wait(time: Time): Promise<void> {
        this.__updateExtra()
        this.__extraMs = Math.min(this.__extraMs, time.inMilliseconds)
        await idle((time.inMilliseconds - this.__extraMs).milliseconds)
        this.__extraMs -= time.inMilliseconds
    }

    /**
     * Updates the extra time tracking based on actual elapsed time.
     */
    private __updateExtra(): void {
        const newTime = Date.now()
        this.__extraMs += newTime - this._time
        this._time = newTime
    }
}

namespace Timer {
    /**
     * Parameters for configuring interval timer behavior.
     */
    export interface IntervalParameters {
        /** Whether to skip triggering on the first call to interval() */
        skipFirstTime?: boolean
    }
}
