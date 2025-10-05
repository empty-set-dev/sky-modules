export interface PopoverType {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
    triggerRef: unknown
    popoverRef: unknown
    arrowRef: unknown
}
