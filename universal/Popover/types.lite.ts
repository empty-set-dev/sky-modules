export interface PopoverType {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
    triggerRef: { current: HTMLElement }
    popoverRef: { current: HTMLElement }
    arrowRef: { current: HTMLElement }
}
