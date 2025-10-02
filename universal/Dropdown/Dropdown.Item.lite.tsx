import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { dropdownItemRecipe } from './Dropdown.Item.recipe.lite'

export default function DropdownItem<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof dropdownItemRecipe> & {
        disabled?: boolean
        selected?: boolean
        value?: any
        onSelect?: (value: any) => void
        closeOnSelect?: boolean
        'aria-label'?: string
        'aria-describedby'?: string
    }
): Mitosis.Node {
    const {
        variant,
        size,
        destructive,
        disabled = false,
        selected = false,
        value,
        onSelect,
        closeOnSelect = true,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props

    const itemRef = useRef(null)

    const handleClick = (event: MouseEvent) => {
        if (disabled) return

        event.preventDefault()

        // Call the item's onSelect first
        if (onSelect) {
            onSelect(value)
        }

        // Then trigger the dropdown's SELECT event for robot3
        const dropdownElement = itemRef.current?.closest('[role="menu"]')
        if (dropdownElement && closeOnSelect) {
            // Dispatch custom event for robot3 state machine
            dropdownElement.dispatchEvent(new CustomEvent('dropdown:select', {
                detail: { value },
                bubbles: true,
            }))
        }

        props.onClick?.(event)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (disabled) return

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault()
                handleClick(event as any)
                break
        }

        props.onKeyDown?.(event)
    }

    const handleFocus = (event: FocusEvent) => {
        if (disabled) return

        // Update robot3 focused state
        const dropdownElement = itemRef.current?.closest('[role="menu"]')
        if (dropdownElement) {
            // Remove focus from other items
            dropdownElement.querySelectorAll('[data-dropdown-item]').forEach(item => {
                item.removeAttribute('data-robot3-focused')
            })

            // Add focus to current item
            itemRef.current?.setAttribute('data-robot3-focused', '')
        }

        props.onFocus?.(event)
    }

    const styles = recipe ?? dropdownItemRecipe({ variant, size, destructive })

    return (
        <Box
            ref={itemRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
            className={clsx('dropdown-item', props.className)}
            role="menuitem"
            tabIndex={disabled ? -1 : 0}
            aria-disabled={disabled}
            aria-selected={selected}
            aria-label={props['aria-label']}
            aria-describedby={props['aria-describedby']}
            data-dropdown-item=""
            data-disabled={disabled ? '' : undefined}
            data-selected={selected ? '' : undefined}
            data-value={value}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
        >
            {props.children}
        </Box>
    )
}