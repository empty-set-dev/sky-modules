import { createContext } from 'react'

namespace internal {
    export const PageContext = createContext<null | Vike.PageContext>(null)
}
export default internal
