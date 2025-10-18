import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import './Row.lite.css'

import * as React from 'react';

export type RowProps<T extends TagName = 'div'> = Design.SlotRootProps<typeof rowRecipe, T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { rowRecipe } from './Row.recipe';

  function Row<T extends TagName = 'div'>(props:RowProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const gutter = props.gutter;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const boxProps = (({ gutter, unstyled, recipe, ...rest }) => rest)(props);
  const styles = unstyled || (recipe ?? rowRecipe)({ gutter });

return (

<Box  {...(boxProps)}  ref={inputRef}  sx={clsx(props.sx, styles)}>{props.children}</Box>

);
}

  export default forwardRef(Row) as typeof Row

