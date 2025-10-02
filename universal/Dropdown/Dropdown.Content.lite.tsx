import { useRef, useEffect } from '@builder.io/mitosis'
import clsx from 'clsx'

import { dropdownContentRecipe } from './Dropdown.Content.recipe.lite'

export default function DropdownContent<T extends TagName = 'div'>(
    props: Design.SlotProps<T, typeof dropdownContentRecipe> & {
        align?: 'start' | 'center' | 'end'
        side?: 'top' | 'right' | 'bottom' | 'left'
        sideOffset?: number
        alignOffset?: number
        avoidCollisions?: boolean
        loop?: boolean
        forceMount?: boolean
        'aria-label'?: string
        'aria-labelledby'?: string
    }
): Mitosis.Node {
    const {
        variant,
        size,
        maxHeight,
        align = 'start',
        side = 'bottom',
        sideOffset = 4,
        alignOffset = 0,
        avoidCollisions = true,
        loop = true,
        forceMount = false,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props

    const contentRef = useRef(null)

    useEffect(() => {
        // Focus management for accessibility
        const content = contentRef.current
        if (!content) return

        const focusFirstItem = () => {
            const firstItem = content.querySelector('[role="menuitem"]:not([aria-disabled="true"])')
            if (firstItem) {
                firstItem.focus()
            }
        }

        // Auto-focus first item when content appears
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'data-state' &&
                    content.getAttribute('data-state') === 'open') {
                    setTimeout(focusFirstItem, 0)
                }
            })
        })

        observer.observe(content, { attributes: true })

        return () => observer.disconnect()
    }, [])

    const handleKeyDown = (event: KeyboardEvent) => {
        const content = contentRef.current
        if (!content) return

        const items = Array.from(
            content.querySelectorAll('[role="menuitem"]:not([aria-disabled="true"])')
        ) as HTMLElement[]

        if (!items.length) return

        const currentIndex = items.findIndex(item => item === document.activeElement)

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                if (loop) {
                    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
                    items[nextIndex]?.focus()
                } else if (currentIndex < items.length - 1) {
                    items[currentIndex + 1]?.focus()
                }
                break

            case 'ArrowUp':
                event.preventDefault()
                if (loop) {
                    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
                    items[prevIndex]?.focus()
                } else if (currentIndex > 0) {
                    items[currentIndex - 1]?.focus()
                }
                break

            case 'Home':
                event.preventDefault()
                items[0]?.focus()
                break

            case 'End':
                event.preventDefault()
                items[items.length - 1]?.focus()
                break

            case 'Tab':
                // Allow tab to exit dropdown
                break

            default:
                // Character navigation
                if (event.key.length === 1) {
                    event.preventDefault()
                    const startIndex = currentIndex + 1
                    const char = event.key.toLowerCase()

                    // Search from current position forward
                    for (let i = 0; i < items.length; i++) {
                        const index = (startIndex + i) % items.length
                        const item = items[index]
                        const text = item.textContent?.toLowerCase() || ''

                        if (text.startsWith(char)) {
                            item.focus()
                            break
                        }
                    }
                }
                break
        }
    }

    const styles = recipe ?? dropdownContentRecipe({ variant, size, maxHeight })

    const positioningStyles = {
        '--radix-dropdown-content-transform-origin': 'var(--radix-popper-transform-origin)',
        '--radix-dropdown-content-available-width': 'var(--radix-popper-available-width)',
        '--radix-dropdown-content-available-height': 'var(--radix-popper-available-height)',
    }

    return (
        <Box
            ref={contentRef}
            {...restProps}
            as={as ?? ('div' as T)}
            sx={clsx(props.sx, unstyled || styles)}
            className={clsx('dropdown-content', props.className)}
            style={{ ...positioningStyles, ...props.style }}
            role="menu"
            tabIndex={-1}
            aria-orientation="vertical"
            aria-label={props['aria-label']}
            aria-labelledby={props['aria-labelledby']}
            data-state="closed"
            data-side={side}
            data-align={align}
            onKeyDown={handleKeyDown}
        >
            {props.children}
        </Box>
    )
}