import { DependencyList, useEffect } from 'react'

export default function useInterval(
    callback: Function,
    interval: Time,
    deps?: DependencyList
): void {
    useEffect(() => {
        const identifier = setInterval(callback, interval.valueOf() * 1000)
        return () => clearInterval(identifier)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interval, ...(deps || [])])
}
