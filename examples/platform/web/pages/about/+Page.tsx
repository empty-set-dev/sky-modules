import 'sky/examples/platform/web/imports'

import { PageLayout } from 'sky/examples/platform/web/layouts/PageLayout'

// const cx = await classnames('AboutPage', import('./AboutPage.scss'))
function cx(name: TemplateStringsArray): string {
    return name[0]
}

export function Page(): ReactNode {
    return (
        <PageLayout>
            <div className={cx`AboutPage`}>
                <h1 className={cx`e:title`}>About</h1>
                <p className={cx`e:text`}>Example of using Sky.</p>
            </div>
        </PageLayout>
    )
}
