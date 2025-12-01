import PopoverController from './PopoverController'

/**
 * Props for Popover component
 */
export interface PopoverProps {
    /** Popover controller instance for managing state and positioning */
    controller: PopoverController
    /** Trigger element that opens the popover */
    trigger: Mitosis.Node
    /** Popover content */
    children?: Mitosis.Children
}

/**
 * Popover component with positioning and arrow
 *
 * Floating popover that appears when trigger is clicked.
 * Uses PopoverController for state management and positioning logic.
 *
 * Compiled to all frameworks via Mitosis.
 *
 * @param props - Component props
 * @returns Mitosis node
 *
 * @example Basic usage
 * ```tsx
 * import Popover, { usePopover } from '@sky-modules/universal/Popover'
 *
 * function MyComponent() {
 *   const popover = usePopover()
 *
 *   return (
 *     <Popover controller={popover} trigger={<button>Open</button>}>
 *       <div>Popover content</div>
 *     </Popover>
 *   )
 * }
 * ```
 *
 * @example With custom positioning
 * ```tsx
 * const popover = usePopover({
 *   placement: 'top',
 *   offset: 10
 * })
 *
 * <Popover controller={popover} trigger={<button>Click</button>}>
 *   Positioned on top
 * </Popover>
 * ```
 */
export default function Popover(props: PopoverProps): Mitosis.Node {
    const { controller, trigger, children } = props

    return (
        <>
            <Box ref={controller.triggerRef} onClick={controller.toggle} asChild>
                {trigger}
            </Box>
            {controller.isOpen && (
                <Box ref={controller.popoverRef} sx={`absolute z-50`}>
                    {children}

                    <Box
                        ref={controller.arrowRef}
                        sx="absolute w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"
                    />
                </Box>
            )}
        </>
    )
}
