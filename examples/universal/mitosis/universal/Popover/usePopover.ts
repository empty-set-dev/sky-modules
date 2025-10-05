import { computePosition, flip, shift, offset, arrow, autoUpdate } from '@floating-ui/dom';
import { useState, useRef, useEffect } from 'react';
import { notUndefined } from '@sky-modules/core';
import { PopoverType } from './types.js';
export interface UsePopoverParameters {
  placement: 'top' | 'right' | 'bottom' | 'left';
  offsetValue: number;
  withArrow: boolean;
}
export default function usePopover(props: UsePopoverParameters): PopoverType {
  const {
    placement,
    offsetValue,
    withArrow
  } = props;
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<HTMLElement>(null);
  let cleanupRef = useRef<() => void>(null);
  const updatePosition = async (): Promise<void> => {
    if (!triggerRef.current || !popoverRef.current) return;
    const middleware = [offset(offsetValue), flip(), shift({
      padding: 8
    })];
    if (withArrow && arrowRef.current) {
      middleware.push(arrow({
        element: arrowRef.current
      }));
    }
    const {
      x,
      y,
      placement: finalPlacement,
      middlewareData
    } = await computePosition(triggerRef.current, popoverRef.current, {
      placement,
      middleware
    });
    Object.assign(popoverRef.current.style, {
      left: `${x}px`,
      top: `${y}px`
    });
    if (withArrow && arrowRef.current && middlewareData.arrow) {
      const {
        x: arrowX,
        y: arrowY
      } = middlewareData.arrow;
      const staticSide = notUndefined({
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      }[finalPlacement.split('-')[0]], 'staticSide');
      Object.assign(arrowRef.current.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-4px'
      });
    }
  };
  useEffect(() => {
    if (!isOpen || !triggerRef.current || !popoverRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    cleanupRef.current = autoUpdate(triggerRef.current, popoverRef.current, updatePosition);
    return (): void => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [isOpen]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      const node = event.target as Node | null;
      if (isOpen && triggerRef.current && popoverRef.current && !triggerRef.current.contains(node) && !popoverRef.current.contains(node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return (): void => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);
  const open = (): void => setIsOpen(true);
  const close = (): void => setIsOpen(false);
  const toggle = (): void => setIsOpen(!isOpen);
  return {
    isOpen,
    open,
    close,
    toggle,
    triggerRef,
    popoverRef,
    arrowRef
  };
}