import { DependencyList, useEffect } from 'react'

export default function useInterval(
    callback: Function,
    interval: number,
    deps?: DependencyList
): void {
    useEffect(() => {
        const interval_ = setInterval(callback, interval)
        return () => clearInterval(interval_)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval, ...deps])
}
