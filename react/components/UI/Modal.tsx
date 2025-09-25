import { createPortal } from 'react-dom'

import * as styles from './Modal.scss'

styles

export interface ModalProps extends PropsWithChildren {
    className?: string
    effect?: Effect
    closeOnClickOutside?: boolean
    close?: () => void
}
export default function Modal(props: ModalProps): ReactNode {
    const modalRoot = notNull(document.getElementById('modal-root'), '#modal-root')

    const ref = useRef<HTMLDivElement>(null)

    let captureProps = {}

    if (props.effect) {
        captureProps = captureUI(props.effect)
    }

    return createPortal(
        <div
            className={`ModalWrapper`}
            {...captureProps}
            onClick={ev => {
                if (props.closeOnClickOutside) {
                    if (props.close == null) {
                        throw new NullError('close')
                    }

                    if (!ref.current!.contains(ev.target as Node)) {
                        props.close()
                    }
                }
            }}
        >
            <div ref={ref} className={`Modal ${props.className}`}>
                {props.children}
            </div>
        </div>,
        modalRoot
    )
}
