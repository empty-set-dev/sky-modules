import runsOnServerSide from 'sky/platform/web/runsOnServerSide'
import { PageContext } from 'vike/types'

import StoreContext from '#/renderer/StoreContext'
import usePageContext from '#/renderer/usePageContext'
import Store from '#/Store'

export default function useStore<T extends new (...args: unknown[]) => InstanceType<T>>(
    Store: T
): InstanceType<T> {
    const pageContext = usePageContext() as PageContext
    const store = useContext(StoreContext)

    if (!store[Store.name as keyof Store]) {
        store[Store.name as keyof Store] = new Store() as never

        if (!runsOnServerSide && pageContext.initial.store[Store.name as keyof Store]) {
            Object.assign(
                store[Store.name as keyof Store],
                pageContext.initial.store[Store.name as keyof Store]
            )
        }
    }

    return store[Store.name as keyof Store] as never
}
