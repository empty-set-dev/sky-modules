import { createContext } from 'react'

namespace local {
    export const PageContext = createContext<null | Vike.PageContext>(null)
}
export default local
