import { DependencyList, useEffect } from 'react'

export default function useEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
    deps?: DependencyList
): ReturnType<typeof global.addEventListener> {
    useEffect(() => {
        window.addEventListener(type, listener, options)
        return (): void => window.removeEventListener(type, listener, options)
    }, [...(deps || [])])
}
