import '#/imports'

import PageLayout from '#/layouts/PageLayout'
import useData from '#/renderer/useData'

import AboutPageData from './+data'
import styles from './AboutPage.module.scss'

const cx = cn('AboutPage', styles)

export function AboutPage(): ReactNode {
    useData(AboutPageData)

    return (
        <PageLayout>
            <div className={cx`AboutPage`}>
                <h1 className={cx`title`}>About</h1>
                <p className={cx`text`}>Example of using Sky.</p>
            </div>
        </PageLayout>
    )
}
