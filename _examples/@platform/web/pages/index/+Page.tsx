import '#/imports'
import { useTranslation } from 'react-i18next'

import Counter from './Counter'

import PageLayout from '#/layouts/PageLayout'

export function Page(): ReactNode {
    // const { isLoading, title, x } = useData(data)

    // console.log(isLoading, title, x)

    const { t } = useTranslation()

    return (
        <PageLayout>
            {t`title`}
            <br />
            <Counter />
        </PageLayout>
    )
}
