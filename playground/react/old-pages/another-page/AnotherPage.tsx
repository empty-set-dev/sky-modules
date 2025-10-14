import '#/imports'
import '@sky-modules/react/components/layout/Box/global'

import Link from '@sky-modules/design/components/Link'
import { usePageContext } from '@sky-modules/react/PageContext'

import styles from './AnotherPage.module.css'
styles

export default async function AnotherPage(): Promise<ReactNode> {
    return (
        <>
            <Link href="/">Link</Link>
        </>
    )
}

export function Page(): ReactNode {
    const pageContext = usePageContext()

    console.log(pageContext)

    return (
        <>
            <Link href="/">Link 2</Link>
        </>
    )
}
