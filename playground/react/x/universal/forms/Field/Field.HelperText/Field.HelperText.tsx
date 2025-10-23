import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Field.HelperText.lite.css'

import * as React from 'react';

  export type FieldHelperTextProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof fieldHelperTextRecipe, T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { fieldHelperTextRecipe } from './Field.HelperText.recipe';

  function FieldHelperText<T extends BoxAs = 'div'>(props:FieldHelperTextProps<T>) {

    // Preserved local variables (added by local-vars-plugin)
  const inputRef = props.inputRef;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const sx = props.sx;
  const boxProps = (({ inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
  const styles = unstyled || (recipe ?? fieldHelperTextRecipe({}));

return (

<Box  {...(boxProps)}  ref={inputRef}  sx={clsx(sx, styles)}>{props.children}</Box>

);
}

  export default FieldHelperText;

