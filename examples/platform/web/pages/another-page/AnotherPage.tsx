import '#/imports'
import Link from 'sky/design/components/Link'

import 'sky/react/components/layout/Box.global'
import styles from './AnotherPage.module.scss'
styles

export default function AnotherPage(): ReactNode {
    return (
        <div className='AnotherPage'>
            <Link href="/">Link</Link>
        </div>
    )
}
