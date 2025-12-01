import '@sky-modules/design/Box/global'
import Mitosis from '@sky-modules/universal/Mitosis'

import FieldErrorText from './Field.ErrorText/Field.ErrorText.lite'
import FieldHelperText from './Field.HelperText/Field.HelperText.lite'
import FieldLabel from './Field.Label/Field.Label.lite'
import FieldRoot from './Field.Root/Field.Root.lite'

/**
 * Props for Field component
 */
export type FieldProps = typeof FieldRoot

Field.Root = FieldRoot
Field.Label = FieldLabel
Field.HelperText = FieldHelperText
Field.ErrorText = FieldErrorText

/**
 * Field component for form inputs
 *
 * Compound component with subcomponents for structured form fields:
 * - Field.Root - Container wrapper
 * - Field.Label - Input label
 * - Field.HelperText - Helper text below input
 * - Field.ErrorText - Error message display
 *
 * Compiled to all frameworks via Mitosis.
 *
 * @param props - Component props
 * @returns Mitosis node
 *
 * @example Basic usage
 * ```tsx
 * import Field from '@sky-modules/universal/forms/Field'
 *
 * <Field>
 *   <Field.Label>Username</Field.Label>
 *   <input type="text" />
 *   <Field.HelperText>Enter your username</Field.HelperText>
 * </Field>
 * ```
 *
 * @example With error
 * ```tsx
 * <Field>
 *   <Field.Label>Email</Field.Label>
 *   <input type="email" />
 *   <Field.ErrorText>Invalid email address</Field.ErrorText>
 * </Field>
 * ```
 *
 * @example Global usage
 * ```tsx
 * import '@sky-modules/universal/forms/Field/global'
 *
 * <Field>
 *   <Field.Label>Name</Field.Label>
 * </Field>
 * ```
 */
export default function Field(props: any): Mitosis.Node {
    return <FieldRoot {...props}>{props.children}</FieldRoot>
}
