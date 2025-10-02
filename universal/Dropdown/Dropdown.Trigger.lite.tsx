import { useRef } from '@builder.io/mitosis'
import clsx from 'clsx'

import { dropdownTriggerRecipe } from './Dropdown.Trigger.recipe.lite'

export default function DropdownTrigger<T extends TagName = 'button'>(
    props: Design.SlotProps<T, typeof dropdownTriggerRecipe> & {
        disabled?: boolean
        'aria-label'?: string
        'aria-labelledby'?: string
        'aria-describedby'?: string
    }
): Mitosis.Node {
    const {
        variant,
        size,
        fullWidth,
        disabled = false,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props

    const triggerRef = useRef(null)

    const handleClick = (event: MouseEvent) => {
        if (disabled) return
        // Context will handle the actual toggle logic
        props.onClick?.(event)
    }

    const handleMouseEnter = (event: MouseEvent) => {
        if (disabled) return
        // Context will handle hover trigger logic
        props.onMouseEnter?.(event)
    }

    const handleFocus = (event: FocusEvent) => {
        if (disabled) return
        // Context will handle focus trigger logic
        props.onFocus?.(event)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (disabled) return

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault()
                // Context will handle opening
                break
            case 'ArrowDown':
            case 'ArrowUp':
                event.preventDefault()
                // Context will handle opening and navigation
                break
        }

        props.onKeyDown?.(event)
    }

    const styles = recipe ?? dropdownTriggerRecipe({ variant, size, fullWidth })

    return (
        <Box
            ref={triggerRef}
            {...restProps}
            as={as ?? ('button' as T)}
            sx={clsx(props.sx, unstyled || styles)}
            className={clsx('dropdown-trigger', props.className)}
            type={as === 'button' ? 'button' : undefined}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-haspopup="menu"
            aria-expanded="false"
            aria-disabled={disabled}
            aria-label={props['aria-label']}
            aria-labelledby={props['aria-labelledby']}
            aria-describedby={props['aria-describedby']}
            data-disabled={disabled ? '' : undefined}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
        >
            {props.children}
        </Box>
    )
}