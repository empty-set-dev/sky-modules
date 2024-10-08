import { useState, PropsWithChildren } from 'react'

export default function ClientOnly(props: PropsWithChildren): ReactNode {
    const [component, setComponent] = useState<null | ReactNode>(null)

    useEffect(() => {
        setComponent(props.children)
    }, [props.children])

    return component
}
