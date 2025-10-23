import globalify from '@sky-modules/core/globalify'

import DatePicker, * as imports from './DatePicker'

declare global {
    const DatePicker: typeof imports.default
    type DatePicker = typeof imports.default
    type DatePickerProps = imports.DatePickerProps
}

globalify({ DatePicker, ...imports })
