import '@sky-modules/design/Box/global'

export type FieldProps = typeof FieldRoot

import  FieldRoot from './Field.Root/Field.Root';
import  FieldLabel from './Field.Label/Field.Label';
import  FieldHelperText from './Field.HelperText/Field.HelperText';
import  FieldErrorText from './Field.ErrorText/Field.ErrorText';

function Field(props:any) {

    // Preserved local variables (added by local-vars-plugin)


return (<>
    <FieldRoot  {...(props)} >{props.children}</FieldRoot>

    </>)
}
Field.Root = FieldRoot;
Field.Label = FieldLabel;
Field.HelperText = FieldHelperText;
Field.ErrorText = FieldErrorText;



export default Field;
