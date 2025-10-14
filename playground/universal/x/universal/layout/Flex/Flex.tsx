import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import * as React from 'react';

export type FlexProps<T extends BoxAs = 'div'> = Design.SlotProps<T, typeof flexRecipe> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { flexRecipe } from './Flex.recipe';

  function Flex<T extends BoxAs = 'div'>(props:FlexProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const direction = props.direction;
  const wrap = props.wrap;
  const align = props.align;
  const justify = props.justify;
  const gap = props.gap;
  const grow = props.grow;
  const shrink = props.shrink;
  const basis = props.basis;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ direction, wrap, align, justify, gap, grow, shrink, basis, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ?? flexRecipe({ direction, wrap, align, justify, gap, grow, shrink, basis });

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div'}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default forwardRef(Flex) as typeof Flex

