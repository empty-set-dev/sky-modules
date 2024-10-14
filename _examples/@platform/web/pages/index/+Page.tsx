import '#/imports'
import data from './+data'
import Counter from './Counter'

import { PageLayout } from '#/layouts/PageLayout'
import useData from '#/renderer/useData'

export function Page(): ReactNode {
    const { isLoading, title, x } = useData(data)

    console.log(isLoading, title, x)

    return (
        <PageLayout>
            Hello, World!
            <br />
            <Counter />
        </PageLayout>
    )
}
