import { setContext } from '@builder.io/mitosis'

import SlotRootContext from './SlotRoot.context.lite'
import { SlotRootState, SlotRootSx } from './types.lite'

export interface SlotRootProviderProps {
    children?: Mitosis.Children
    sx: SlotRootSx
    state: SlotRootState
}
export default function SlotRootProvider(props: SlotRootProviderProps): Mitosis.Node {
    setContext(SlotRootContext, {
        sx: props.sx,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        state: props.state as any,
    })
    return <>{props.children}</>
}
