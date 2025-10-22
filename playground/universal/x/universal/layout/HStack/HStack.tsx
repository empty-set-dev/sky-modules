import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import * as React from 'react';

export type HStackProps<T extends TagName = 'div'> = Design.SlotProps<T, typeof hstackRecipe> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { hstackRecipe } from './HStack.recipe';

  function HStack<T extends TagName = 'div'>(props:HStackProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const spacing = props.spacing;
  const align = props.align;
  const justify = props.justify;
  const wrap = props.wrap;
  const reverse = props.reverse;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ spacing, align, justify, wrap, reverse, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ?? hstackRecipe({ spacing, align, justify, wrap, reverse });

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default React.forwardRef(HStack) as typeof HStack

