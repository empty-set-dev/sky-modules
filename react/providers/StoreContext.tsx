import { createContext } from 'react'

const StoreContext = createContext({})
export default StoreContext

export function StoreProvider(props: { store: Store } & PropsWithChildren): ReactNode {
    return <StoreContext.Provider value={props.store}>{props.children}</StoreContext.Provider>
}
