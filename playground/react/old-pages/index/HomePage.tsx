import '#/setup'
import '@sky-modules/react/components/layout/Box/global'
import { interpret } from 'robot3'

// import { useTranslation } from 'react-i18next'

// import Boo from '../../components/Boo'

import Link from '@sky-modules/design/components/Link'
import { sxWith } from '@sky-modules/react/sx'
// import buttonMachine from '@sky-modules/UI/machines/buttonMachine'

import styles from './HomePage.module.scss'

const sx = sxWith(cn(styles))

export default function HomePage(): ReactNode {
    // const { t } = useTranslation('some')

    const apiData: any = {}

    // Console.log(42)

    // useData(HomePageData)

    useEffect(() => {
        // async(onTest, 42)
    }, [])

    const Foo = sx.form`
        @Foo
        bg-pink-500
    `

    const [count, setCount] = useState(0)

    // useMemo(() => {
    //     const button = interpret(buttonMachine, () => {})

    //     button.send('submit')
    //     const button2 = interpret(buttonMachine, () => {})

    //     console.log(button, button2)
    // }, [])

    return (
        <div className="font-mono">
            <Link href="/another-page">To Another Page</Link>
            {/* <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
                <h1>Vike + Hono + Cloudflare Workers</h1>
                <p>
                    <strong>Message:</strong> {apiData.message}
                </p>
                <p>
                    <strong>Location:</strong> {apiData.location.city}, {apiData.location.country}
                    {apiData.location.colo && ` (colo: ${apiData.location.colo})`}
                </p>
                <p>This page was rendered at the edge, closest to you! 🌍</p>
            </div>
            <Boo One Two="A" /> */}

            {/* <Boo.Root One>
                <Boo.Some One />
                <Boo.Some2 One a="b" />
            </Boo.Root> */}
            {/* <Foo sx="flex mt-3 align-center">aspect 2</Foo>
            <Box sx="flex mt-2 align-center">aspect</Box>
            <Box className={styles.Box2}>aspect</Box>
            <Box className={cx`@Box2`}></Box>
            <Box sx={cx`Box2`}>aspect</Box>
            <Box className={cx`@Box2`} sx="aspect-[16/9]">
                aspect
                <br />
            </Box> */}
        </div>
    )
}
