import { createPortal } from 'react-dom'

import * as styles from './Modal.scss'

styles

export interface ModalProps extends PropsWithChildren {
    className?: string
}
export default function Modal(props: ModalProps): ReactNode {
    const modalRoot = document.getElementById('modal-root')!

    // const b = `Modal`

    return createPortal(
        <div className={`ModalWrapper`}>
            <div className={`Modal ${props.className}`}>{props.children}</div>
        </div>,
        modalRoot
    )
}
