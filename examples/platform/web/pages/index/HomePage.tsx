import '#/imports'
import 'sky/react/components/layout/Box.global'

// import { useTranslation } from 'react-i18next'
import useData from 'sky/platform/web/renderer/useData'

import Page from '#/layouts/Page'

import Boo from '../../components/Boo'

import HomePageData from './+data'
Boo
import { onTest } from './HomePage.telefunc'

import styles from './HomePage.module.scss'

const cx = cn(styles)
const sx = sxWith(cx)

export default function HomePage(): ReactNode {
    // const { t } = useTranslation('some')

    Console.log(42)

    useData(HomePageData)

    useEffect(() => {
        async(onTest, 42)
    }, [])

    const Foo = sx.form`
        @Foo
        bg-pink-500
    `

    return (
        <Page>
            {/* <Boo One Two="A" />

            <Boo.Root One>
                <Boo.Some One />
                <Boo.Some2 One a="b" />
            </Boo.Root> */}

            <Foo sx="flex mt-3 align-center">aspect 2</Foo>
            <Box sx="flex mt-2 align-center">aspect</Box>
            <Box className={styles.Box2}>aspect</Box>
            <Box className={cx`@Box2`}></Box>
            <Box sx={cx`Box2`}>aspect</Box>
            <Box className={cx`@Box2`} sx="aspect-[16/9]">
                aspect
                {/* <Span sx={cx`@title`}></Span><br /> */}
            </Box>
        </Page>
    )
}
