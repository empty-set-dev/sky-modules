import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Field.Root.lite.css'

import * as React from 'react';

  export type FieldRootProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof fieldRootRecipe, T> & {
inputRef?: unknown;
required?: boolean;
invalid?: boolean;
disabled?: boolean;
readOnly?: boolean;
}

  import  clsx from 'clsx';
import  { fieldRootRecipe } from './Field.Root.recipe';

  function FieldRoot<T extends BoxAs = 'div'>(props:FieldRootProps<T>) {

    // Preserved local variables (added by local-vars-plugin)
  const required = props.required;
  const invalid = props.invalid;
  const disabled = props.disabled;
  const readOnly = props.readOnly;
  const inputRef = props.inputRef;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const sx = props.sx;
  const boxProps = (({ required, invalid, disabled, readOnly, inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
  const styles = unstyled || (recipe ?? fieldRootRecipe({ required, invalid, disabled, readOnly }));

return (

<Box  {...(boxProps)}  ref={inputRef}  sx={clsx(sx, styles)}>{props.children}</Box>

);
}

  export default FieldRoot;

