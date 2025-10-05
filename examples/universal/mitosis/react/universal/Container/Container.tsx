'use client';
import * as React from 'react';

import { useRef } from 'react'

  import  clsx from 'clsx';
import  { containerRecipe } from './Container.recipe.js';

  function Container(props:Design.SlotProps<T, typeof containerRecipe>) {

    // Preserved local variables (added by local-vars-plugin)
  const size = props.size;
  const padding = props.padding;
  const center = props.center;
  const fluid = props.fluid;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ size, padding, center, fluid, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ??
        containerRecipe({
            size,
            padding,
            center,
            fluid,;

const containerRef = useRef(null);

return (

<Box  ref={containerRef}  {...(restProps)}  as={as ?? 'div' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default Container;

