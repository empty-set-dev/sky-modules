// Animation frame loop
export default class FrameLoop {
    private callbacks = new Set<(deltaTime: number, totalTime: number) => void>()
    private isRunning = false
    private lastTime = 0
    private startTime = 0

    start(): void {
        if (this.isRunning) return

        this.isRunning = true
        this.startTime = performance.now()
        this.lastTime = this.startTime
        this.loop()
    }

    stop(): void {
        this.isRunning = false
    }

    subscribe(callback: (deltaTime: number, totalTime: number) => void): () => void {
        this.callbacks.add(callback)

        if (!this.isRunning) {
            this.start()
        }

        return () => {
            this.callbacks.delete(callback)

            if (this.callbacks.size === 0) {
                this.stop()
            }
        }
    }

    unsubscribe(callback: (deltaTime: number, totalTime: number) => void): void {
        this.callbacks.delete(callback)

        if (this.callbacks.size === 0) {
            this.stop()
        }
    }

    private loop = (): void => {
        if (!this.isRunning) return

        const currentTime = performance.now()
        const deltaTime = (currentTime - this.lastTime) / 1000
        const totalTime = (currentTime - this.startTime) / 1000

        this.lastTime = currentTime

        this.callbacks.forEach(callback => {
            try {
                callback(deltaTime, totalTime)
            } catch (error) {
                console.error('Error in frame callback:', error)
            }
        })

        requestAnimationFrame(this.loop)
    }
}

export const frameLoop = new FrameLoop()

// Frame callback hook
export function onFrame(callback: (deltaTime: number, totalTime: number) => void): () => void {
    return frameLoop.subscribe(callback)
}

// Direct unsubscribe method
onFrame.unsubscribe = (callback: (deltaTime: number, totalTime: number) => void): void => {
    frameLoop.unsubscribe(callback)
}
