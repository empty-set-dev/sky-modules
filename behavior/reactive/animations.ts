// Animation system - универсальные анимации для любых значений

import { signal, computed, effect, Signal, Computed } from './signals'
import { onFrame } from './frame-loop'

// Spring animation configuration
export interface SpringConfig {
    tension?: number
    friction?: number
    mass?: number
    precision?: number
}

// Spring animator class
class SpringAnimator {
    private value: number
    private velocity: number = 0
    private target: number
    private config: Required<SpringConfig>

    constructor(initialValue: number, config: SpringConfig = {}) {
        this.value = initialValue
        this.target = initialValue
        this.config = {
            tension: config.tension ?? 170,
            friction: config.friction ?? 26,
            mass: config.mass ?? 1,
            precision: config.precision ?? 0.01,
        }
    }

    setTarget(target: number): void {
        this.target = target
    }

    update(deltaTime: number): boolean {
        const { tension, friction, mass, precision } = this.config

        // Spring physics
        const force = -tension * (this.value - this.target)
        const damping = -friction * this.velocity
        const acceleration = (force + damping) / mass

        this.velocity += acceleration * deltaTime
        this.value += this.velocity * deltaTime

        // Check if animation is finished
        const isFinished =
            Math.abs(this.velocity) < precision && Math.abs(this.value - this.target) < precision

        if (isFinished) {
            this.value = this.target
            this.velocity = 0
        }

        return !isFinished
    }

    getValue(): number {
        return this.value
    }

    reset(value?: number): void {
        this.value = value ?? this.target
        this.velocity = 0
    }
}

// Spring signal
export function spring(target: Signal<number> | number, config: SpringConfig = {}): Signal<number> {
    const targetSignal = typeof target === 'number' ? signal(target) : target
    const springValue = signal(targetSignal())
    const animator = new SpringAnimator(targetSignal(), config)

    let unsubscribeFrame: (() => void) | null = null
    let isAnimating = false

    const startAnimation = () => {
        if (isAnimating) return

        isAnimating = true
        unsubscribeFrame = onFrame(deltaTime => {
            const stillAnimating = animator.update(deltaTime)
            springValue.set(animator.getValue())

            if (!stillAnimating) {
                stopAnimation()
            }
        })
    }

    const stopAnimation = () => {
        isAnimating = false

        if (unsubscribeFrame) {
            unsubscribeFrame()
            unsubscribeFrame = null
        }
    }

    // Watch target changes
    effect(() => {
        const newTarget = targetSignal()
        animator.setTarget(newTarget)
        startAnimation()
    })

    return springValue
}

// Tween configuration
export interface TweenConfig {
    duration: number
    easing?: (t: number) => number
    autoStart?: boolean
}

// Easing functions
export const easing = {
    linear: (t: number) => t,
    easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
    easeOut: (t: number) => t * (2 - t),
    easeIn: (t: number) => t * t,
    easeInCubic: (t: number) => t * t * t,
    easeOutCubic: (t: number) => --t * t * t + 1,
    easeInOutCubic: (t: number) =>
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
    easeOutBounce: (t: number) => {
        const n1 = 7.5625
        const d1 = 2.75

        if (t < 1 / d1) {
            return n1 * t * t
        } else if (t < 2 / d1) {
            return n1 * (t -= 1.5 / d1) * t + 0.75
        } else if (t < 2.5 / d1) {
            return n1 * (t -= 2.25 / d1) * t + 0.9375
        } else {
            return n1 * (t -= 2.625 / d1) * t + 0.984375
        }
    },
}

// Tween controls
export interface TweenControls {
    start(): void
    stop(): void
    restart(): void
    isPlaying(): boolean
}

// Tween function
export function tween(
    from: number,
    to: number,
    config: TweenConfig
): [Signal<number>, TweenControls] {
    const value = signal(from)
    const isPlaying = signal(config.autoStart ?? false)

    const easingFn = config.easing ?? easing.linear
    let startTime: number | null = null
    let unsubscribeFrame: (() => void) | null = null

    const start = () => {
        if (isPlaying()) return

        isPlaying.set(true)
        startTime = null

        unsubscribeFrame = onFrame((deltaTime, totalTime) => {
            if (startTime === null) {
                startTime = totalTime
            }

            const elapsed = totalTime - startTime
            const progress = Math.min(elapsed / config.duration, 1)
            const easedProgress = easingFn(progress)
            const currentValue = from + (to - from) * easedProgress

            value.set(currentValue)

            if (progress >= 1) {
                stop()
            }
        })
    }

    const stop = () => {
        isPlaying.set(false)

        if (unsubscribeFrame) {
            unsubscribeFrame()
            unsubscribeFrame = null
        }
    }

    const restart = () => {
        stop()
        value.set(from)
        start()
    }

    const controls: TweenControls = {
        start,
        stop,
        restart,
        isPlaying: () => isPlaying(),
    }

    // Auto start if configured
    if (config.autoStart) {
        start()
    }

    return [value, controls]
}

// Timeline for sequencing animations
export class Timeline {
    private animations: Array<{
        delay: number
        animation: () => void
    }> = []

    add(animation: () => void, delay: number = 0): this {
        this.animations.push({ delay, animation })
        return this
    }

    play(): void {
        this.animations.forEach(({ delay, animation }) => {
            setTimeout(animation, delay * 1000)
        })
    }

    clear(): this {
        this.animations = []
        return this
    }
}

// Utility for animating between values
export function animate(
    from: number,
    to: number,
    duration: number,
    callback: (value: number) => void,
    easingFn: (t: number) => number = easing.linear
): () => void {
    let startTime: number | null = null
    let isRunning = true

    const unsubscribe = onFrame((deltaTime, totalTime) => {
        if (!isRunning) return

        if (startTime === null) {
            startTime = totalTime
        }

        const elapsed = totalTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easingFn(progress)
        const value = from + (to - from) * easedProgress

        callback(value)

        if (progress >= 1) {
            isRunning = false
            unsubscribe()
        }
    })

    return () => {
        isRunning = false
        unsubscribe()
    }
}

// Clock for time-based animations
export function clock(): Computed<{ elapsed: number; delta: number }> {
    const startTime = performance.now() / 1000
    const time = signal(0)

    onFrame((deltaTime, totalTime) => {
        time.set(totalTime)
    })

    return computed(() => ({
        elapsed: time() - startTime,
        delta: 0, // Will be updated in frame loop
    }))
}