// Behavior/Reactive - универсальная реактивная система

// Signals и реактивность
export {
    signal,
    computed,
    effect,
    reactive
} from './signals'
export type { Signal, Computed } from './signals'

// Frame loop
export {
    frameLoop,
    onFrame,
    FrameLoop
} from './frame-loop'

// Анимации
export {
    spring,
    tween,
    easing,
    animate,
    clock,
    Timeline
} from './animations'
export type {
    SpringConfig,
    TweenConfig,
    TweenControls
} from './animations'