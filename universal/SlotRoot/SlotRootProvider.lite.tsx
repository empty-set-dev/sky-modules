import { setContext } from '@builder.io/mitosis'

import SlotRootContext from './SlotRoot.context.lite'
import { SlotRootController, SlotRootStyles } from './types.lite'

/**
 * Props for SlotRootProvider component
 */
export interface SlotRootProviderProps {
    /** Child components */
    children?: Mitosis.Children
    /** Styles to apply to slotted children */
    styles?: SlotRootStyles
    /** Controller for managing slot state */
    controller?: SlotRootController
}

/**
 * SlotRoot provider for passing styles and controller to children
 *
 * Enables "asChild" pattern where parent component styles are applied
 * to child component instead of creating wrapper elements.
 *
 * Used internally by polymorphic components.
 *
 * Compiled to all frameworks via Mitosis.
 *
 * @param props - Component props
 * @returns Mitosis node
 *
 * @example Basic usage
 * ```tsx
 * import SlotRootProvider from '@sky-modules/universal/SlotRoot'
 *
 * <SlotRootProvider styles={{ className: 'button-styles' }}>
 *   <CustomButton />
 * </SlotRootProvider>
 * ```
 *
 * @example With controller
 * ```tsx
 * const controller = { state: 'active' }
 *
 * <SlotRootProvider controller={controller} styles={styles}>
 *   {children}
 * </SlotRootProvider>
 * ```
 */
export default function SlotRootProvider(props: SlotRootProviderProps): Mitosis.Node {
    const context = {
        ...(props.styles ? { styles: props.styles } : null),
        ...(props.controller ? { controller: props.controller } : null),
    }
    setContext(SlotRootContext, context)
    return <>{props.children}</>
}
