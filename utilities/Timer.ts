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

    time(): number {
        return Date.now() - this['__time']
    }

    isOn(label: string): boolean {
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

    log(label: string): void {
        if (!this.isOn(label)) {
            return
        }

        // eslint-disable-next-line no-console
        console.log(this.label + label, this.time())
    }

    private ['__label']: string
    private ['__time']!: number
}
