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
        this.reset()
    }

    get label(): string {
        return this['__label'] ? this['__label'] + ': ' : ''
    }

    reset(): void {
        this['__time'] = Date.now()
    }

    time(): Time {
        const dt = Date.now() - this['__time']
        this['__time'] += dt
        return Time(dt, milliseconds)
    }

    isOn(label?: string): boolean {
        if (!label) {
            return timers[this.label] !== false
        }

        const parts = label.split(':')
        let partLabel = this.label

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i]
            partLabel += part

            if (timers[partLabel] === false) {
                return false
            }

            partLabel += ':'
        }

        return true
    }

    log(label?: string): void {
        if (!this.isOn(label)) {
            return
        }

        logConsole(this.label + (label ?? ''), this.time().seconds + 's')
    }

    trace(label?: string): void {
        if (!this.isOn(label)) {
            return
        }

        traceConsole(this.label + label, this.time().seconds + 's')
    }

    private ['__label']: string
    private ['__time']!: number
}
