import { createContext } from 'react'
import Store from 'sky/commands/assets/web-initial/App'

const StoreContext = createContext({})
export default StoreContext

export function StoreProvider(props: { store: Store } & PropsWithChildren): ReactNode {
    return <StoreContext.Provider value={props.store}>{props.children}</StoreContext.Provider>
}
