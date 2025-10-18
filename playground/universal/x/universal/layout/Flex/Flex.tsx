import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import * as React from 'react';

  export type FlexProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof flexRecipe, T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { flexRecipe } from './Flex.recipe';

  function Flex<T extends BoxAs = 'div'>(props:FlexProps<T>) {

    // Preserved local variables (added by local-vars-plugin)
  const direction = props.direction;
  const wrap = props.wrap;
  const align = props.align;
  const justify = props.justify;
  const gap = props.gap;
  const grow = props.grow;
  const shrink = props.shrink;
  const basis = props.basis;
  const inputRef = props.inputRef;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const sx = props.sx;
  const boxProps = (({ direction, wrap, align, justify, gap, grow, shrink, basis, inputRef, unstyled, recipe, sx, ...rest }) => rest)(props);
  const styles = unstyled ||
        (recipe ?? flexRecipe({ direction, wrap, align, justify, gap, grow, shrink, basis }));

return (

<Box  {...(boxProps)}  ref={inputRef}  sx={clsx(sx, styles)}>{props.children}</Box>

);
}

  export default Flex;

