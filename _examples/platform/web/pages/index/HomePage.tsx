import '#/imports'
import { useTranslation } from 'react-i18next'
import useStore from 'sky/platform/web/hooks/useStore'

import PageLayout from '#/layouts/PageLayout'
import useData from '#/renderer/useData'
import { CounterStore } from '#/Store'

import HomePageData from './+data'
import Counter from './Counter'

export default function HomePage(): ReactNode {
    useData(HomePageData)
    const counterStore = useStore(CounterStore)
    console.log(counterStore)

    const { t } = useTranslation()

    return (
        <PageLayout>
            {t`title`}
            <br />
            <Counter />
        </PageLayout>
    )
}
