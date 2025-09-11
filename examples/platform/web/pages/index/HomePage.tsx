import '#/imports'
import 'sky/react/components/layout/Box.global'
import { interpret } from 'robot3'

// import { useTranslation } from 'react-i18next'

// import Boo from '../../components/Boo'

import { sxWith } from 'sky/react/sx'
// import buttonMachine from 'sky/UI/machines/buttonMachine'

import { onTest } from './HomePage.telefunc'

import styles from './HomePage.module.scss'
const cx = cn(styles)
const sx = sxWith(cx)

export default function HomePage(): ReactNode {
    // const { t } = useTranslation('some')

    const apiData: any = {}

    Console.log(42)

    // useData(HomePageData)

    useEffect(() => {
        async(onTest, 42)
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
        <>
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
            </div> */}
            {/* <Boo One Two="A" />

            <Boo.Root One>
                <Boo.Some One />
                <Boo.Some2 One a="b" />
            </Boo.Root> */}
            <div
                onClick={e => {
                    e.preventDefault()
                    setCount(c => c + 1)
                }}
                className="flex justify-center align-center mt-5 cursor-pointer"
            >
                <a href="/another-page" className="text-blue-500 underline">
                    Another Page
                </a>
                {count}
            </div>
            <Foo sx="flex mt-3 align-center">aspect 2</Foo>
            <Box sx="flex mt-2 align-center">aspect</Box>
            <Box className={styles.Box2}>aspect</Box>
            <Box className={cx`@Box2`}></Box>
            <Box sx={cx`Box2`}>aspect</Box>
            <Box className={cx`@Box2`} sx="aspect-[16/9]">
                aspect
                {/* <Span sx={cx`@title`}></Span> */}
                <br />
            </Box>
        </>
    )
}
