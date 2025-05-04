import { useEffect, DependencyList } from 'react'

export default function useAnimationFrames(callback: () => void, deps?: DependencyList): void {
    useEffect(() => {
        let animationFrameHandle = requestAnimationFrame(onAnimationFrame)

        function onAnimationFrame(): void {
            callback()
            animationFrameHandle = requestAnimationFrame(onAnimationFrame)
        }

        return (): void => cancelAnimationFrame(animationFrameHandle)
    }, [...(deps || [])])
}
