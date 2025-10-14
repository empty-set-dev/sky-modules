import { useState } from '@builder.io/mitosis'

export interface Controller {
    onChange(callback: () => void): void
}
export default function useController<T extends Controller>(): [T | null, (controller: T) => void] {
    const [update, setUpdate] = useState(false)
    const [controller, setController] = useState<T | null>(null)

    useEffect(() => {
        controller?.onChange(() => setUpdate(!update))
    }, [])

    return [controller, setController]
}
