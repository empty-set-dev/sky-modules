import { useContext } from '@builder.io/mitosis'

import { SlotRootContext, SlotRootContextType } from './index.lite'

export default function useSlotRoot(): SlotRootContextType {
    return useContext(SlotRootContext)
}
