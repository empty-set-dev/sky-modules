import { createContext } from '@builder.io/mitosis'

import { SlotRootContextType } from './types.lite'

export default createContext({
    styles: {} as SlotRootContextType['styles'],
    controller: {} as SlotRootContextType['controller'],
})
