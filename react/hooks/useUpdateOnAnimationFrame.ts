import { useState } from 'react'

export default function useUpdateOnAnimationFrame(): void {
    const [, setUpdate] = useState(false)

    useEffect(() => {
        requestAnimationFrame(update)

        function update(): void {
            requestAnimationFrame(update)
            setUpdate(update => !update)
        }
    }, [])
}
