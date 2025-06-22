import { createPortal } from 'react-dom'

import * as styles from './Modal.scss'

styles

export interface ModalProps extends PropsWithChildren {
    className?: string
    effect?: Effect
}
export default function Modal(props: ModalProps): ReactNode {
    const modalRoot = document.getElementById('modal-root')!

    let captureProps = {}

    if (props.effect) {
        captureProps = captureUI(props.effect)
    }

    return createPortal(
        <div className={`ModalWrapper`} {...captureProps}>
            <div className={`Modal ${props.className}`}>{props.children}</div>
        </div>,
        modalRoot
    )
}
