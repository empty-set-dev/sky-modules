import '#/imports'
import { useTranslation } from 'react-i18next'

import data from './+data'
import Counter from './Counter'

import PageLayout from '#/layouts/PageLayout'
import useData from '#/renderer/useData'

export function HomePage(): ReactNode {
    const { isLoading, title, x, result } = useData(data)

    console.log(isLoading, title, x, result)

    const { t } = useTranslation()

    return (
        <PageLayout>
            {t`title`}
            <br />
            <Counter />
        </PageLayout>
    )
}
