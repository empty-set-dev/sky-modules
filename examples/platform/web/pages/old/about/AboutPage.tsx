import useData from 'sky/platform/web/renderer/useData'

import PageLayout from '#/layouts/Page'

import AboutPageData from './+data'

import styles from './AboutPage.module.scss'
const cx = cn(styles)

export function AboutPage(): ReactNode {
    const b = 'AboutPage'

    // useData(AboutPageData)

    return (
        <PageLayout>
            <div className={cx`AboutPage`}>
                <h1 className={cx`${b}-title`}>About</h1>
                <p className={cx`${b}-text`}>Example of using Sky.</p>
            </div>
        </PageLayout>
    )
}
