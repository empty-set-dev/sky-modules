import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import * as React from 'react';

export type ColProps<T extends BoxAs = 'div'> = Design.SlotProps<T, typeof colRecipe> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { colRecipe } from './Col.recipe';

  function Col<T extends BoxAs = 'div'>(props:ColProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const span = props.span;
  const offset = props.offset;
  const order = props.order;
  const flex = props.flex;
  const push = props.push;
  const pull = props.pull;
  const xs = props.xs;
  const sm = props.sm;
  const md = props.md;
  const lg = props.lg;
  const xl = props.xl;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ span, offset, order, flex, push, pull, xs, sm, md, lg, xl, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ??
        colRecipe({
            span,
            offset,
            order,
            flex,
            push,
            pull,
            xs,
            sm,
            md,
            lg,
            xl,
        });

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div'}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default forwardRef(Col) as typeof Col

