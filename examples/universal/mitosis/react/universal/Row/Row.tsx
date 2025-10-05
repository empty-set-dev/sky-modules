'use client';
import * as React from 'react';

import { useRef } from 'react'

  import  clsx from 'clsx';
import  { rowRecipe } from './Row.recipe.js';

  function Row(props:Design.SlotProps<T, typeof rowRecipe>) {

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
            reverse,;

const rowRef = useRef(null);

return (

<Box  ref={rowRef}  {...(restProps)}  as={as ?? 'div' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default Row;

