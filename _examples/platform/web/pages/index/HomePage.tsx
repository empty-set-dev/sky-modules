import '../../../../pkgs/@artsy/fresnel/imports'
import { useTranslation } from 'react-i18next'

import PageLayout from '#/layouts/PageLayout'
import useData from '../../../../pkgs/@artsy/fresnel/renderer/useData'

import HomePageData from './+data'
import Counter from './Counter'

export function HomePage(): ReactNode {
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
