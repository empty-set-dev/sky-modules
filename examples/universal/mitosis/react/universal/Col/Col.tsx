'use client';
import * as React from 'react';

import { useRef } from 'react'

  import  clsx from 'clsx';
import  { colRecipe } from './Col.recipe.js';

  function Col(props:Design.SlotProps<T, typeof colRecipe>) {

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
            xl,;

const colRef = useRef(null);

return (

<Box  ref={colRef}  {...(restProps)}  as={as ?? 'div' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default Col;

