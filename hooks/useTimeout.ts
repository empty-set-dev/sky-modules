import { DependencyList, useEffect } from 'react'

export default function useTimeout(
    callback: Function,
    interval: number,
    deps?: DependencyList
): void {
    useEffect(() => {
        const identifier = setTimeout(callback, interval)
        return () => clearTimeout(identifier)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval, ...deps])
}
