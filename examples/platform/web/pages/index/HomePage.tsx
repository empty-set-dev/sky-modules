import '#/imports'
// import { useTranslation } from 'react-i18next'

import useData from 'sky/platform/web/renderer/useData'

import PageLayout from '#/layouts/PageLayout'

import HomePageData from './+data'
import { onTest } from './HomePage.telefunc'

import styles from './HomePage.module.scss'

import 'sky/react/components/layout/Box.global'
const cx = cn(styles)

export default function HomePage(): ReactNode {
    // const { t } = useTranslation('some')

    Console.log(42)

    useData(HomePageData)

    useEffect(() => {
        async(onTest, 42)
    }, [])

    return (
        <PageLayout>
            <Box className="aspect-[18/24]">aspect</Box>
            <Box className={cx`aspect-[18/24] Box2 ${{ foo: true }}`}>aspect</Box>
            <Box flex p={2} h={6} className={`aspect-[16/9] Box3`}>
                aspect
            </Box>
        </PageLayout>
    )
}
