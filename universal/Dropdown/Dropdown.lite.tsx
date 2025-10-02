import { useRef, useState } from '@builder.io/mitosis'
import clsx from 'clsx'

import { dropdownRecipe } from './Dropdown.recipe.lite'

export default function Dropdown<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof dropdownRecipe> & {
        open?: boolean
        onOpenChange?: (open: boolean) => void
        defaultOpen?: boolean
        disabled?: boolean
        trigger?: 'click' | 'hover' | 'focus'
        placement?: 'bottom' | 'top' | 'left' | 'right'
        offset?: number
        closeOnSelect?: boolean
        closeOnEscape?: boolean
        closeOnClickOutside?: boolean
        'aria-label'?: string
        'aria-labelledby'?: string
    }
): Mitosis.Node {
    const {
        variant,
        size,
        shadow,
        border,
        open: controlledOpen,
        onOpenChange,
        defaultOpen = false,
        disabled = false,
        trigger = 'click',
        placement = 'bottom',
        offset = 4,
        closeOnSelect = true,
        closeOnEscape = true,
        closeOnClickOutside = true,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props

    const [internalOpen, setInternalOpen] = useState(defaultOpen)
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

    const dropdownRef = useRef(null)
    const triggerRef = useRef(null)
    const contentRef = useRef(null)
    const [focusedIndex, setFocusedIndex] = useState(-1)

    const handleOpenChange = (newOpen: boolean) => {
        if (disabled) return
        if (onOpenChange) {
            onOpenChange(newOpen)
        } else {
            setInternalOpen(newOpen)
        }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (disabled) return

        switch (event.key) {
            case 'Enter':
            case ' ':
                if (!isOpen) {
                    event.preventDefault()
                    handleOpenChange(true)
                }
                break
            case 'Escape':
                if (isOpen && closeOnEscape) {
                    event.preventDefault()
                    handleOpenChange(false)
                    triggerRef.current?.focus()
                }
                break
            case 'ArrowDown':
                if (isOpen) {
                    event.preventDefault()
                    setFocusedIndex(prev => {
                        const items = contentRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
                        if (!items?.length) return prev
                        return prev < items.length - 1 ? prev + 1 : 0
                    })
                } else {
                    event.preventDefault()
                    handleOpenChange(true)
                }
                break
            case 'ArrowUp':
                if (isOpen) {
                    event.preventDefault()
                    setFocusedIndex(prev => {
                        const items = contentRef.current?.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
                        if (!items?.length) return prev
                        return prev > 0 ? prev - 1 : items.length - 1
                    })
                }
                break
        }
    }

    const handleClickOutside = (event: Event) => {
        if (!isOpen || !closeOnClickOutside) return
        const target = event.target as HTMLElement
        if (!dropdownRef.current?.contains(target)) {
            handleOpenChange(false)
        }
    }

    const styles = recipe ?? dropdownRecipe({ variant, size, shadow, border })

    const contextValue = {
        isOpen,
        disabled,
        focusedIndex,
        setFocusedIndex,
        handleOpenChange,
        handleKeyDown,
        triggerRef,
        contentRef,
        placement,
        offset,
        closeOnSelect,
        trigger,
    }

    return (
        <Box
            ref={dropdownRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
            role="menu"
            aria-haspopup="true"
            aria-expanded={isOpen}
            aria-disabled={disabled}
            aria-label={props['aria-label']}
            aria-labelledby={props['aria-labelledby']}
            data-state={isOpen ? 'open' : 'closed'}
            data-disabled={disabled ? '' : undefined}
            onKeyDown={handleKeyDown}
        >
            {props.children}
        </Box>
    )
}