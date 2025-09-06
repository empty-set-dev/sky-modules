import '#/imports'
import { useTranslation } from 'react-i18next'
import useData from 'sky/platform/web/renderer/useData'
import Container from 'sky/styles/helpers/layout/Container'

import PageLayout from '#/layouts/PageLayout'

import HomePageData from './+data'
import { onTest } from './HomePage.telefunc'

export default function HomePage(): ReactNode {
    // const { t } = useTranslation('some')

    Console.log(42)

    useData(HomePageData)

    useEffect(() => {
        async(onTest, 42)
    }, [])

    return (
        <PageLayout>
        </PageLayout>
    )
}
