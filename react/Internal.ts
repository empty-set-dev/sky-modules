import { createContext } from 'react'

namespace Internal {
    export const PageContext = createContext<null | Vike.PageContext>(null)
}

export default Internal
