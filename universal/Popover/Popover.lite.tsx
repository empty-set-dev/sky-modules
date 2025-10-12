import PopoverController from './PopoverController'

export interface PopoverProps {
    controller: PopoverController
    trigger: Mitosis.Node
    children?: Mitosis.Children
}
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
