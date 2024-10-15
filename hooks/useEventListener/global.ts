import globalify from 'sky/helpers/globalify'

import * as pkg from '.'

globalify({ useEventListener: pkg.default })

declare global {
    function useEventListener<K extends keyof WindowEventMap>(
        type: K,
        listener: (this: Window, ev: WindowEventMap[K]) => unknown,
        options?: boolean | AddEventListenerOptions,
        deps?: React.DependencyList
    ): ReturnType<typeof global.addEventListener>
}
