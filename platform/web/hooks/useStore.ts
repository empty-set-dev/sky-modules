import Store from 'sky/commands/assets/web-initial/App'
import StoreContext from 'sky/platform/web/contexts/StoreContext'

export default function useStore<T extends new (...args: unknown[]) => InstanceType<T>>(
    Store: T
): InstanceType<T> {
    const store = useContext(StoreContext)

    if (!store[Store.name as keyof Store]) {
        store[Store.name as keyof Store] = new Store() as never
    } else if (!((store[Store.name as keyof Store] as unknown) instanceof Store)) {
        const newStore = new Store() as never
        Object.assign(newStore, store[Store.name as keyof Store])
        store[Store.name as keyof Store] = newStore
    }

    return store[Store.name as keyof Store] as never
}
