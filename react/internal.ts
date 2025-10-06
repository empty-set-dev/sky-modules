import { createContext } from 'react'

export default internal
namespace internal {
    export const PageContext = createContext<null | Vike.PageContext>(null)
}
