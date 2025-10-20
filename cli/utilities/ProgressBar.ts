import Console from './Console'

export class ProgressBar {
    private current = 0
    private total: number
    private currentFile = ''
    private barLength = 30
    private simulationInterval: NodeJS.Timeout | null = null

    constructor(total: number) {
        this.total = total
    }

    update(current: number, fileName: string): void {
        this.current = current
        this.currentFile = fileName

        this.render()
    }

    increment(fileName: string): void {
        this.current++
        this.currentFile = fileName

        this.render()
    }

    /**
     * Start simulating progress when real progress is not available
     */
    startSimulation(): void {
        let dots = 0
        this.simulationInterval = setInterval(() => {
            dots = (dots + 1) % 4
            const dotString = '.'.repeat(dots).padEnd(3, ' ')
            Console.write(`\r🔨 Compiling ${this.total} components${dotString}`)
        }, 300)
    }

    stopSimulation(): void {
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval)
            this.simulationInterval = null
            Console.write('\r' + ' '.repeat(100) + '\r')
        }
    }

    private render(): void {
        // Stop simulation if it's running
        this.stopSimulation()

        const percentage = Math.floor((this.current / this.total) * 100)
        const filled = Math.floor((this.current / this.total) * this.barLength)
        const empty = this.barLength - filled

        const bar = '█'.repeat(filled) + '░'.repeat(empty)
        const progress = `${this.current}/${this.total}`

        // Clear previous line and write new progress
        Console.write(
            `\r🔨 [${bar}] ${percentage}% (${progress}) - ${this.currentFile.substring(0, 60)}`
        )
    }

    complete(): void {
        this.stopSimulation()
        Console.write('\n')
    }

    clear(): void {
        this.stopSimulation()
        Console.write('\r' + ' '.repeat(100) + '\r')
    }
}
