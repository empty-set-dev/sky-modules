import { DependencyList } from 'react'

export default function useEnterKey(callback: () => void, deps: DependencyList): void {
    useEffect(() => {
        function handleKey(e: KeyboardEvent): void {
            if (e.key === 'Enter') {
                e.preventDefault()
                callback()
            }
        }

        window.addEventListener('keydown', handleKey)

        return (): void => {
            window.removeEventListener('keydown', handleKey)
        }
    }, [deps])
}
