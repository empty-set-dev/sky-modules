import { DependencyList, useEffect } from 'react'

export default function useInterval(
    callback: Function,
    interval: number,
    deps?: DependencyList
): void {
    useEffect(() => {
        const identifier = setInterval(callback, interval)
        return () => clearInterval(identifier)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval, ...deps])
}
