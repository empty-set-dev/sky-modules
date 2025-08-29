import 'sky/commands/assets/web-initial/imports'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import useData from 'sky/platform/web/renderer/useData'

import PageLayout from '#/layouts/PageLayout'

import HomePageData from './+data'
import Counter from './Counter'
import { onTest } from './HomePage.telefunc'

export default observer(function HomePage(): ReactNode {
    const { t } = useTranslation()

    useData(HomePageData)

    useEffect(() => {
        async(onTest, 42)
    }, [])

    return (
        <PageLayout>
            {t`title`}
            <br />
            <Counter />
        </PageLayout>
    )
})
