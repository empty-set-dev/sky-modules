import '#setup'


export default function HomePage(): ReactNode {
    const pageContext = usePageContext()
    // const { t } = useTranslation('some')

    const apiData: any = {}

    // Console.log(42)

    // useData(HomePageData)

    useEffect(() => {
        async(onTest, 42)
    }, [])

    return (
        <div className="font-mono">
        </div>
    )
}
