import { onMount, useState } from '@builder.io/mitosis'
import { onCleanup } from 'solid-js'

export interface Controller {
    onChange(callback: () => void): void
    dispose(): void | PromiseLike<void>
}
export default function useController<T extends Controller>(): [T | null, (controller: T) => void] {
    const [update, setUpdate] = useState(false)
    const [controller, setController] = useState<T | null>(null)

    onMount(() => {
        const updateComponent = (): void => setUpdate(!update)
        controller?.onChange(updateComponent)
        onCleanup(() => {
            controller?.dispose()
        })
    })

    return [controller, setController]
}
