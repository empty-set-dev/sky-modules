import { PopoverType } from './types.lite'

export interface PopoverProps {
    popover: PopoverType
    trigger: Mitosis.Node
    children?: Mitosis.Children
}
export default function Popover({ popover, trigger, children }: PopoverProps): Mitosis.Node {
    return (
        <>
            <Box as="div" ref={popover.triggerRef} onClick={popover.toggle} asChild>
                {trigger}
            </Box>

            {popover.isOpen && (
                <Box
                    ref={popover.popoverRef}
                    sx={`absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-3`}
                >
                    {children}

                    <Box
                        ref={popover.arrowRef}
                        sx="absolute w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"
                    />
                </Box>
            )}
        </>
    )
}
