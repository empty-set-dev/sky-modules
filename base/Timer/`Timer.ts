const timers: Record<string, boolean> = {}

export default class Timer {
    static on(label: string): void {
        delete timers[label]
    }

    static off(label: string): void {
        timers[label] = false
    }

    static isOn(label: string): boolean {
        const parts = label.split(':')
        let partLabel: string = ''

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

    constructor(label?: string) {
        this['__label'] = label ?? ''
        this.reset()
    }

    reset(): void {
        this['__time'] = Date.now()
    }

    time(): number {
        return Date.now() - this['__time']
    }

    log(label: string): void {
        if (!Timer.isOn(this['__label'] + label)) {
            return
        }

        // eslint-disable-next-line no-console
        console.log(label, this.time())
    }

    private __label: string
    private __time!: number
}
