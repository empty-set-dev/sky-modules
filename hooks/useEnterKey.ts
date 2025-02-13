import { DependencyList } from 'react'

export default function useEnterKey(callback: () => void, deps: DependencyList): void {
    useEffect(() => {
        function handleKey(ev: KeyboardEvent): void {
            if (ev.key === 'Enter') {
                ev.preventDefault()
                callback()
            }
        }

        window.addEventListener('keydown', handleKey)

        return (): void => {
            window.removeEventListener('keydown', handleKey)
        }
    }, [deps])
}
