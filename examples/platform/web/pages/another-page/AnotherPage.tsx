import '#/imports'
import 'sky/react/components/layout/Box.global'
import { Suspense } from 'react'
import { usePageContext } from 'sky/react/PageContextProvider'

import { onDataA, onDataB, onDataC, onTest } from './AnotherPage.telefunc'

export default function AnotherPage(): ReactNode {
    const pageContext = usePageContext()

    useEffect(() => {
        setTimeout(() => {
            async(async () => {
                pageContext.data.a = await onDataA()
            })
        }, 1500)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            async(async () => {
                pageContext.data.b = await onDataB()
            })
        }, 2500)
    }, [])

    useEffect(() => {
        setTimeout(() => {
            async(async () => {
                pageContext.data.c = await onDataC()
            })
        }, 3500)
    }, [])

    return (
        <>
            <Box asChild sx="flex justify-center align-center font-mono">
                <a href="/">To Home</a>
            </Box>
            <Suspense fallback="Loading...">
                {JSON.stringify(pageContext.data, null, '    ')}
            </Suspense>
        </>
    )
}
