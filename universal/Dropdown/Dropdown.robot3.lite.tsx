import { useRef, useEffect, useState } from '@builder.io/mitosis'
import { useMachine } from '@sky-modules/behavior/robot3'
import { dropdown } from '@sky-modules/behavior/dropdown.robot3'

import Dropdown from './Dropdown.lite'
import DropdownTrigger from './Dropdown.Trigger.lite'
import DropdownContent from './Dropdown.Content.lite'
import DropdownItem from './Dropdown.Item.lite'

export default function DropdownRobot3(props: {
    children: any
    onSelect?: (value: any) => void
    defaultOpen?: boolean
    disabled?: boolean
    variant?: string
    size?: string
}): Mitosis.Node {
    const { children, onSelect, defaultOpen = false, disabled = false, variant, size } = props

    const dropdownRef = useRef(null)
    const [machine, send] = useMachine(dropdown, {
        onSelect,
    })

    const isOpen = machine.matches('open') || machine.matches('opening')
    const isOpening = machine.matches('opening')
    const isClosing = machine.matches('closing')

    useEffect(() => {
        if (defaultOpen && machine.matches('closed')) {
            send('OPEN')
        }
    }, [defaultOpen])

    useEffect(() => {
        const element = dropdownRef.current
        if (!element) return

        // Handle escape key
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                send('ESCAPE')
            } else if (event.key === 'Tab') {
                send('TAB')
            } else if (event.key === 'ArrowDown') {
                send('ARROW_DOWN')
            } else if (event.key === 'ArrowUp') {
                send('ARROW_UP')
            }
        }

        // Handle click outside
        const handleClickOutside = (event: MouseEvent) => {
            if (!element.contains(event.target as Node)) {
                send('CLICK_OUTSIDE')
            }
        }

        // Handle item selection
        const handleSelect = (event: CustomEvent) => {
            send('SELECT', { value: event.detail.value })
        }

        // Handle animation end
        const handleAnimationEnd = () => {
            send('ANIMATION_END')
        }

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.addEventListener('click', handleClickOutside)
            element.addEventListener('dropdown:select', handleSelect as EventListener)
            element.addEventListener('animationend', handleAnimationEnd)
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('click', handleClickOutside)
            element.removeEventListener('dropdown:select', handleSelect as EventListener)
            element.removeEventListener('animationend', handleAnimationEnd)
        }
    }, [isOpen, send])

    const handleTriggerClick = () => {
        if (disabled) return
        send('TOGGLE')
    }

    const getContentState = () => {
        if (machine.matches('closed')) return 'closed'
        if (machine.matches('opening')) return 'opening'
        if (machine.matches('open')) return 'open'
        if (machine.matches('closing')) return 'closing'
        return 'closed'
    }

    return (
        <Dropdown
            ref={dropdownRef}
            variant={variant}
            size={size}
            open={isOpen}
            disabled={disabled}
            data-state={getContentState()}
        >
            {children}
        </Dropdown>
    )
}

// Export compound components with robot3 integration
DropdownRobot3.Trigger = function DropdownTriggerRobot3(props: any) {
    return (
        <DropdownTrigger
            {...props}
            onClick={() => {
                // Robot3 will handle the state change
            }}
        />
    )
}

DropdownRobot3.Content = function DropdownContentRobot3(props: any) {
    return (
        <DropdownContent
            {...props}
            data-state="closed" // Will be updated by robot3
        />
    )
}

DropdownRobot3.Item = function DropdownItemRobot3(props: any) {
    return <DropdownItem {...props} data-dropdown-item="" />
}
