import '#/imports'
import { PageLayout } from 'layouts/PageLayout'
import { useTranslation } from 'react-i18next'

import { useData } from '../../../../@pkgs/clickhouse/client-web/renderer/useData'

import { init } from './+data'

export function Page(): ReactNode {
    const data = useData()
    useEffect(() => {
        if (afterHydration) {
            return
        }

        console.log(init({ lng: data.lng } as never))
    }, [])

    return <PageLayout>Hello, World!</PageLayout>
}
