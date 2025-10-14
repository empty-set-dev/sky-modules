import { setContext } from '@builder.io/mitosis'

import SlotRootContext from './SlotRoot.context.lite'
import { SlotRootController, SlotRootStyles } from './types.lite'

export interface SlotRootProviderProps {
    children?: Mitosis.Children
    styles?: SlotRootStyles
    controller?: SlotRootController
}
export default function SlotRootProvider(props: SlotRootProviderProps): Mitosis.Node {
    const context = {
        ...(props.styles ? { styles: props.styles } : null),
        ...(props.controller ? { controller: props.controller } : null),
    }
    setContext(SlotRootContext, context)
    return <>{props.children}</>
}
