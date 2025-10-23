import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Field.Label.lite.css'

import * as React from 'react';

  export type FieldLabelProps<T extends BoxAs = 'label'> = Design.SlotRootProps<typeof fieldLabelRecipe, T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { fieldLabelRecipe } from './Field.Label.recipe';

  function FieldLabel<T extends BoxAs = 'label'>(props:FieldLabelProps<T>) {

    // Preserved local variables (added by local-vars-plugin)
  const inputRef = props.inputRef;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const sx = props.sx;
  const boxProps = (({ inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
  const styles = unstyled || (recipe ?? fieldLabelRecipe());

return (

<Box  {...(boxProps)}  ref={inputRef}  sx={clsx(sx, styles)}>{props.children}</Box>

);
}

  export default FieldLabel;

