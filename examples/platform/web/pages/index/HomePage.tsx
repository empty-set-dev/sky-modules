import '#/imports'
import { useTranslation } from 'react-i18next'
import useData from 'sky/platform/web/renderer/useData'
import Container from 'sky/styles/helpers/layout/Container'

import PageLayout from '#/layouts/PageLayout'

import HomePageData from './+data'
import Counter from './Counter'
import { onTest } from './HomePage.telefunc'

export default function HomePage(): ReactNode {
    const { t } = useTranslation('common')

    useData(HomePageData)

    t('title')

    useEffect(() => {
        async(onTest, 42)
    }, [])

    return (
        <PageLayout>
            <Container />
            {t`title`}
            <div className="md:mt-2">1234</div>
            <br />
            <Counter />
        </PageLayout>
    )
}
