import globalify from '@sky-modules/core/globalify'

//@ts-expect-error x
import { SlotRootProvider, useSlotRoot } from '#/x/universal/SlotRoot'

import { SlotRootProviderProps } from './SlotRootProvider.lite'
import { SlotRootContextType } from './types.lite'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function SlotRootProvider(props: SlotRootProviderProps): any
    function useSlotRoot(): SlotRootContextType
}

globalify({ SlotRootProvider, useSlotRoot })
