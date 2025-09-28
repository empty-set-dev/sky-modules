import '#/imports'
// import { useTranslation } from 'react-i18next'
// import Container from '@sky-modules/design/helpers/layout/Container'
// import useData from '@sky-modules/platform/web/renderer/useData'

import HomePageData from './+data'
import Counter from './Counter'
import { onTest } from './HomePage.telefunc'

export default function HomePage(): ReactNode {
    // const { t } = useTranslation('some')

    Console.log(42)

    // useData(HomePageData)

    useEffect(() => {
        task(onTest, 42)
    }, [])

    return 'HomePage'

    // return (
    //     <PageLayout>
    //         <Container />
    //         {/* {t`title`} */}
    //         <div className="md:mt-2">1234</div>
    //         <br />
    //         <Counter />
    //     </PageLayout>
    // )
}
