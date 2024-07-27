import globalify from 'sky/helpers/globalify'

import * as lib from '.'

globalify({ useEventListener: lib.default })

declare global {
    export default function useEventListener<K extends keyof WindowEventMap>(
        type: K,
        listener: (this: Window, ev: WindowEventMap[K]) => unknown,
        options?: boolean | AddEventListenerOptions,
        deps?: React.DependencyList
    ): ReturnType<typeof global.addEventListener>
}
