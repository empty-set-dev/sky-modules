import '#/imports'
import { useTranslation } from 'react-i18next'
import useData from 'sky/platform/web/renderer/useData'

import PageLayout from '#/layouts/PageLayout'

import HomePageData from './+data'
import { onTest } from './HomePage.telefunc'

import styles from './HomePage.module.scss'

console.log('------', styles)
import 'sky/react/components/layout/Box.global'
import { flexContainer } from './HomePage.css'

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
            <div className={flexContainer}>123</div>
            <Box sx={'test'}>aspect</Box>
            <Box sx={cx`aspect-[18/24] @Box2 ${{ foo: true }}`}>aspect</Box>
            <Box flex p={2} h={6} sx={cx`aspect-[16/9] @Box3`}>
                aspect
                <span className={cx`@title`}></span>
            </Box>
        </PageLayout>
    )
}
