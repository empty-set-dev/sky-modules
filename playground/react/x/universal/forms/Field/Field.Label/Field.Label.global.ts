import globalify from '@sky-modules/core/globalify';
import Field_Label, * as imports from './Field.Label';
declare global {
  const Field_Label: typeof imports.default;
  type Field_Label = typeof imports.default;
  type FieldLabelProps = imports.FieldLabelProps;
}
globalify({
  Field_Label,
  ...imports
})