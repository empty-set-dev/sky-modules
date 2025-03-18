import runsOnServerSide from 'sky/platform/web/runsOnServerSide'

import Store from '#/Store'

import type { PageContext } from 'vike/types'

export default function getStore<T extends new (...args: unknown[]) => InstanceType<T>>(
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
