import globalify from '@sky-modules/core/globalify'

import Modal, * as imports from './Modal'

declare global {
    const Modal: typeof imports.default
    type Modal = typeof imports.default
    type ModalProps = imports.ModalProps
}

globalify({ Modal, ...imports })
