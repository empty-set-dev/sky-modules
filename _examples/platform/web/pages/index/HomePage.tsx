import '#/imports'
import { useTranslation } from 'react-i18next'

import PageLayout from '#/layouts/PageLayout'
import useData from '#/renderer/useData'

import HomePageData from './+data'
import Counter from './Counter'

export default function HomePage(): ReactNode {
    useData(HomePageData)

    const { t } = useTranslation()

    return (
        <PageLayout>
            {t`title`}
            <br />
            <Counter />
        </PageLayout>
    )
}
