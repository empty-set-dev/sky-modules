import { usePageContext } from '../../renderer/usePageContext'

export function Page(): ReactNode {
    const pageContext = usePageContext()
    let { abortReason } = pageContext
    if (!abortReason) {
        abortReason = pageContext.is404 ? 'Page not found.' : 'Something went wrong.'
    }
    return (
        <Center>
            <p style={{ fontSize: '1.3em' }}>{abortReason}</p>
        </Center>
    )
}

function Center({ children }: { children: ReactNode }): ReactNode {
    return (
        <div
            style={{
                height: 'calc(100vh - 100px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            {children}
        </div>
    )
}
