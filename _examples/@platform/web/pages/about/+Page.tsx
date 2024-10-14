import '#/imports'
import { PageLayout } from '#/layouts/PageLayout'

// const cx = cn('AboutPage', await import('./AboutPage.module.scss'))

export function Page(): ReactNode {
    return (
        <PageLayout>
            123
            {/* <div className={cx`AboutPage`}>
                <h1 className={cx`title`}>About</h1>
                <p className={cx`text`}>Example of using Sky.</p>
            </div> */}
        </PageLayout>
    )
}
