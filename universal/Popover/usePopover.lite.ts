import { useRef, useState } from '@builder.io/mitosis'
import { computePosition, flip, shift, offset, arrow, autoUpdate } from '@floating-ui/dom'

import { PopoverType } from './types.lite'

export interface UsePopoverParameters {
    placement: 'top' | 'right' | 'bottom' | 'left'
    offsetValue: number
    withArrow: boolean
}
export default function usePopover({
    placement,
    offsetValue,
    withArrow,
}: UsePopoverParameters): PopoverType {
    const [isOpen, setIsOpen] = useState(false)
    const triggerRef = useRef<HTMLElement>(null)
    const popoverRef = useRef<HTMLElement>(null)
    const arrowRef = useRef<HTMLElement>(null)
    let cleanupRef = useRef<() => void>(null)

    const updatePosition = async (): Promise<void> => {
        if (!triggerRef || !popoverRef) return

        const middleware = [offset(offsetValue), flip(), shift({ padding: 8 })]

        if (withArrow && arrowRef) {
            middleware.push(arrow({ element: arrowRef }))
        }

        const {
            x,
            y,
            placement: finalPlacement,
            middlewareData,
        } = await computePosition(triggerRef, popoverRef, {
            placement,
            middleware,
        })

        Object.assign(popoverRef.style, {
            left: `${x}px`,
            top: `${y}px`,
        })

        // Позиционирование стрелки
        if (withArrow && arrowRef && middlewareData.arrow) {
            const { x: arrowX, y: arrowY } = middlewareData.arrow

            const staticSide = notUndefined(
                {
                    top: 'bottom',
                    right: 'left',
                    bottom: 'top',
                    left: 'right',
                }[finalPlacement.split('-')[0]],
                'staticSide'
            )

            Object.assign(arrowRef.style, {
                left: arrowX != null ? `${arrowX}px` : '',
                top: arrowY != null ? `${arrowY}px` : '',
                right: '',
                bottom: '',
                [staticSide]: '-4px',
            })
        }
    }

    useEffect(() => {
        if (!isOpen || !triggerRef || !popoverRef) return

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        cleanupRef = autoUpdate(triggerRef, popoverRef, updatePosition)

        return (): void => {
            if (cleanupRef) {
                cleanupRef()
            }
        }
    }, [isOpen])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            const node = event.target as Node | null

            if (
                isOpen &&
                triggerRef &&
                popoverRef &&
                !triggerRef.contains(node) &&
                !popoverRef.contains(node)
            ) {
                setIsOpen(false)
            }
        }

        const handleEscape = (event: KeyboardEvent): void => {
            if (event.key === 'Escape' && isOpen) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('keydown', handleEscape)
        }

        return (): void => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleEscape)
        }
    }, [isOpen])

    const open = (): void => setIsOpen(true)
    const close = (): void => setIsOpen(false)
    const toggle = (): void => setIsOpen(!isOpen)

    return {
        isOpen,
        open,
        close,
        toggle,
        triggerRef,
        popoverRef,
        arrowRef,
    }
}
