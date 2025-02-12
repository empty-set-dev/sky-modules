import { DependencyList, useEffect } from 'react'

export default function useTimeout(
    callback: Function,
    interval: Time,
    deps?: DependencyList
): void {
    useEffect(() => {
        const identifier = setTimeout(callback, interval.valueOf() * 1000)
        return (): void => clearTimeout(identifier)
    }, [interval, ...(deps || [])])
}
