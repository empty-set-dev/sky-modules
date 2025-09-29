import { setContext } from '@builder.io/mitosis'

import SlotRootContext from './SlotRoot.context.lite'
import { SlotRootStore, SlotRootStyles } from './types.lite'

export interface SlotRootProviderProps {
    children?: Mitosis.Children
    sx: SlotRootStyles
    store: SlotRootStore
}
export default function SlotRootProvider(props: SlotRootProviderProps): Mitosis.Node {
    setContext(SlotRootContext, {
        sx: props.sx,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        store: props.store as any,
    })
    return <>{props.children}</>
}
