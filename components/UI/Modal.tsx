import { createPortal } from 'react-dom'

import * as styles from './Modal.scss'

styles

export interface ModalProps extends PropsWithChildren {
    className?: string
    effect?: Effect
    closeOnClickOutside: boolean
    close?: () => void
}
export default function Modal(props: ModalProps): ReactNode {
    const modalRoot = document.getElementById('modal-root')!

    let captureProps = {}

    if (props.effect) {
        captureProps = captureUI(props.effect)
    }

    return createPortal(
        <div
            className={`ModalWrapper`}
            {...captureProps}
            onClick={() => {
                if (props.closeOnClickOutside) {
                    if (isNull(props.close)) {
                        throw new NullError()
                    }

                    props.close()
                }
            }}
        >
            <div className={`Modal ${props.className}`}>{props.children}</div>
        </div>,
        modalRoot
    )
}
