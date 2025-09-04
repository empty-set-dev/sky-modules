import '#/imports'
import { useTranslation } from 'react-i18next'
import useData from 'sky/platform/web/renderer/useData'
import Container from 'sky/styles/helpers/layout/Container'

import PageLayout from '#/layouts/PageLayout'

import HomePageData from './+data'
import Counter from './Counter'
import { onTest } from './HomePage.telefunc'
import { Media } from 'sky/platform/web/media'

export default function HomePage(): ReactNode {
    const { t } = useTranslation()
    console.log(platform)

    useData(HomePageData)

    useEffect(() => {
        async(onTest, 42)
    }, [])

    return (
        <PageLayout>
            <Container />
            <Media greaterThanOrEqual={}
            {t`title`}
            <div className="md:mt-2">1234</div>
            <br />
            <Counter />
        </PageLayout>
    )
}
