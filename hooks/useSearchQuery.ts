import { useEffect, useRef, useState } from 'react'

import usePageContext from '#/renderer/usePageContext'

export default function useSearchQuery(): [
    Record<string, string>,
    (data: Record<string, string>) => void,
] {
    const pageContext = usePageContext()

    const [state, setState] = useState(pageContext.urlParsed.search)
    const first = useRef(true)

    useEffect(() => {
        if (first.current) {
            first.current = false
            return
        }

        const searcQuery = Object.keys(state)
            .filter(k => {
                return !!state[k]
            })
            .map(k => {
                return `${k}=${state[k]}`
            })
            .join('&')

        window.history.pushState(
            null,
            '',
            window.location.pathname + (searcQuery !== '' ? `?${searcQuery}` : '')
        )
    }, [state])

    return [
        state,
        (data): void => {
            setState(state => {
                return {
                    ...state,
                    ...data,
                }
            })
        },
    ]
}
