import { useState, useRef, useEffect } from 'react'
export interface Controller {
    onChange(callback: () => void): void
}
export default function useController<
    T extends Controller,
>(): [T | null, (value: T) => void] {
    const [, setUpdate] = useState(false)
    const [controller, setController] = useState<T | null>(null)
    useEffect(() => {
        return controller?.onChange(() => setUpdate(update => !update))
    }, [controller])
    return [controller, setController]
}
