import '@sky-modules/design/Box/global'

import * as React from 'react';

  export type FieldProps = typeof FieldRoot

  import  Mitosis from '@sky-modules/universal/Mitosis';
import  FieldErrorText from './Field.ErrorText/Field.ErrorText';
import  FieldHelperText from './Field.HelperText/Field.HelperText';
import  FieldLabel from './Field.Label/Field.Label';
import  FieldRoot from './Field.Root/Field.Root';

  function Field(props:any) {

    // Preserved local variables (added by local-vars-plugin)


return (

<FieldRoot  {...(props)}>{props.children}</FieldRoot>

);
}
Field.Root = FieldRoot;
Field.Label = FieldLabel;
Field.HelperText = FieldHelperText;
Field.ErrorText = FieldErrorText;



  export default Field;

