// SolidJS интеграция для Spring анимаций
import { createSignal, createEffect, onCleanup, Accessor } from 'solid-js'

import { spring, SpringConfig } from './animations'
import { signal } from './signals'

// Хук для использования Spring с SolidJS реактивностью
export function useSpring(
    target: Accessor<number> | number,
    config: SpringConfig = {}
): Accessor<number> {
    const [springValue, setSpringValue] = createSignal(
        typeof target === 'number' ? target : target()
    )

    const targetSignal = signal(typeof target === 'number' ? target : target())

    const springSignal = spring(targetSignal, config)

    createEffect(() => {
        const newTarget = typeof target === 'number' ? target : target()
        targetSignal.set(newTarget)
    })

    createEffect(() => {
        const updateValue = (): void => {
            setSpringValue(springSignal())
        }

        updateValue()

        const intervalId = setInterval(updateValue, 16) // ~60fps

        onCleanup(() => {
            clearInterval(intervalId)
        })
    })

    return springValue
}
