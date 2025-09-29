import { createContext } from '@builder.io/mitosis'

import { SlotRootContextType } from './types.lite'

export default createContext({
    sx: {} as SlotRootContextType['sx'],
    store: {} as SlotRootContextType['store'],
})
