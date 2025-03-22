import '#/client/imports'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'

import PageLayout from '#/layouts/PageLayout'
import useData from 'sky/platform/web/renderer/useData'

import HomePageData from './+data'
import Counter from './Counter'

export default observer(function HomePage(): ReactNode {
    const { t } = useTranslation()

    useData(HomePageData)

    return (
        <PageLayout>
            {t`title`}
            <br />
            <Counter />
        </PageLayout>
    )
})
