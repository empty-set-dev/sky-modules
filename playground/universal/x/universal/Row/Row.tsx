import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import * as React from 'react';

export type RowProps<T extends TagName = 'div'> = Design.SlotProps<T, typeof rowRecipe> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { rowRecipe } from './Row.recipe';

  function Row<T extends TagName = 'div'>(props:RowProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const gutter = props.gutter;
  const align = props.align;
  const justify = props.justify;
  const wrap = props.wrap;
  const reverse = props.reverse;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ gutter, align, justify, wrap, reverse, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ??
        rowRecipe({
            gutter,
            align,
            justify,
            wrap,
            reverse,
        });

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default forwardRef(Row) as typeof Row

