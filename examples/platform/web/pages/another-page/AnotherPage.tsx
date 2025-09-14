import '#/imports'
import 'sky/react/components/layout/Box.global'

import Link from 'sky/design/components/Link'
import { usePageContext } from 'sky/react/extensions/PageContext'

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
