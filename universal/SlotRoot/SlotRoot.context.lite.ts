import { createContext } from '@builder.io/mitosis'

import { SlotRootContextType } from './types.lite'

export default createContext({
    sx: {} as SlotRootContextType['sx'],
    state: {} as SlotRootContextType['state'],
})
