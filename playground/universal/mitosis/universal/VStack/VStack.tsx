'use client';
import * as React from 'react';

import { useRef } from 'react'

  import  clsx from 'clsx';
import  { vstackRecipe } from './VStack.recipe';

  function VStack<T extends TagName = 'div'>(props:Design.SlotProps<T, typeof vstackRecipe>) {

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
  const styles = recipe ?? vstackRecipe({ spacing, align, justify, wrap, reverse });

const stackRef = useRef(null);

return (

<Box  ref={stackRef}  {...(restProps)}  as={as ?? 'div' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default VStack;

