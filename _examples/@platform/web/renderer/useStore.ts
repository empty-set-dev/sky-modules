import runsOnServerSide from 'sky/@platform/web/helpers/runsOnServerSide'
import { PageContext } from 'vike/types'

import Store from '../Store'

import StoreContext from './StoreContext'
import usePageContext from './usePageContext'

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

export function getStore<T extends new (...args: unknown[]) => InstanceType<T>>(
    pageContext: PageContext,
    Store: T
): InstanceType<T> {
    const { store } = pageContext.initial

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
