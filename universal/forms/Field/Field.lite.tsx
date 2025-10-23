import '@sky-modules/design/Box/global'

import FieldErrorText from './Field.ErrorText/Field.ErrorText.lite'
import FieldHelperText from './Field.HelperText/Field.HelperText.lite'
import FieldLabel from './Field.Label/Field.Label.lite'
import FieldRoot from './Field.Root/Field.Root.lite'

export type FieldProps = typeof FieldRoot

Field.Root = FieldRoot
Field.Label = FieldLabel
Field.HelperText = FieldHelperText
Field.ErrorText = FieldErrorText

export default function Field(props: any): Mitosis.Node {
    return <FieldRoot {...props}>{props.children}</FieldRoot>
}
