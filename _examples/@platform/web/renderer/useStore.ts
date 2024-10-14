import runsOnServerSide from 'sky/@platform/web/helpers/runsOnServerSide'

import Store from '../Store'

import StoreContext from './StoreContext'
import { usePageContext } from './usePageContext'

export default function useStore<T extends new (...args: unknown[]) => InstanceType<T>>(
    Store: T,
    storeName: keyof Store
): InstanceType<T> {
    const pageContext = usePageContext()
    const store = useContext(StoreContext)

    if (!store[storeName]) {
        store[storeName] = new Store() as never

        if (!runsOnServerSide && pageContext.data.store[storeName]) {
            Object.assign(store[storeName], pageContext.data.store[storeName])
        }
    }

    return store[storeName] as never
}
