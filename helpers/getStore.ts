import usePageContext from 'sky/platform/web/renderer/usePageContext'

export default function getStore<T extends new (...args: unknown[]) => InstanceType<T>>(
    pageContext: ReturnType<typeof usePageContext>,
    Store: T
): InstanceType<T> {
    const { store } = (pageContext as never as { initial: { store: InstanceType<T> } }).initial

    if (!store[Store.name as keyof Store]) {
        store[Store.name as keyof Store] = new Store() as never
    } else if (!((store[Store.name as keyof Store] as unknown) instanceof Store)) {
        const newStore = new Store() as never
        Object.assign(newStore, store[Store.name as keyof Store])
        store[Store.name as keyof Store] = newStore
    }

    return store[Store.name as keyof Store] as never
}
