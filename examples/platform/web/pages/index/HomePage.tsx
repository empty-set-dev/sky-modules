import '#/imports'
import { useTranslation } from 'react-i18next'

import { css } from 'defines/../styled-system/css'
import useData from 'sky/platform/web/renderer/useData'

import PageLayout from '#/layouts/PageLayout'

import HomePageData from './+data'
import { onTest } from './HomePage.telefunc'

import styles from './HomePage.module.scss'
console.log('------', styles)
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
            <Box sx={css({ bg: 'rose.100' })}>aspect</Box>
            <Box sx={cx`aspect-[18/24] @Box2 ${{ foo: true }}`}>aspect</Box>
            <Box flex p={2} h={6} sx={cx`aspect-[16/9] @Box3`}>
                aspect
                <span className={cx`@title`}></span>
            </Box>
        </PageLayout>
    )
}
