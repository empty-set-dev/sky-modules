export interface PopoverType {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
    triggerRef: HTMLElement
    popoverRef: HTMLElement
    arrowRef: HTMLElement
}
