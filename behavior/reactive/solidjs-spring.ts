// SolidJS интеграция для Spring анимаций
import { createSignal, createEffect, onCleanup, Accessor } from 'solid-js'

import { spring, SpringConfig } from './animations'
import { signal } from './signals'

// Хук для использования Spring с SolidJS реактивностью
export function useSpring(
    target: Accessor<number> | number,
    config: SpringConfig = {}
): Accessor<number> {
    // Создаем SolidJS сигнал для результата
    const [springValue, setSpringValue] = createSignal(
        typeof target === 'number' ? target : target()
    )

    // Создаем внутренний сигнал для Spring системы
    const targetSignal = signal(typeof target === 'number' ? target : target())

    // Создаем Spring с внутренней реактивностью
    const springSignal = spring(targetSignal, config)

    // Эффект для синхронизации target значения
    createEffect(() => {
        const newTarget = typeof target === 'number' ? target : target()
        targetSignal.set(newTarget)
    })

    // Эффект для подписки на изменения spring значения
    createEffect(() => {
        // Подписываемся на изменения spring сигнала
        const updateValue = (): void => {
            setSpringValue(springSignal())
        }

        // Запускаем сразу для получения текущего значения
        updateValue()

        // Создаем интервал для отслеживания изменений Spring
        const intervalId = setInterval(updateValue, 16) // ~60fps

        onCleanup(() => {
            clearInterval(intervalId)
        })
    })

    return springValue
}
