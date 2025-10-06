'use client';
import * as React from 'react';

import { useRef } from 'react'

  import  clsx from 'clsx';
import  { layoutHeaderRecipe } from './Layout.Header.recipe.js';

  function LayoutHeader<T extends TagName = 'header'>(props:Design.SlotProps<T, typeof layoutHeaderRecipe>) {

    // Preserved local variables (added by local-vars-plugin)
  const variant = props.variant;
  const sticky = props.sticky;
  const shadow = props.shadow;
  const border = props.border;
  const background = props.background;
  const height = props.height;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ variant, sticky, shadow, border, background, height, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ??
        layoutHeaderRecipe({
            variant,
            sticky,
            shadow,
            border,
            background,
            height,
        });

const headerRef = useRef(null);

return (

<Box  ref={headerRef}  {...(restProps)}  as={as ?? 'header' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default LayoutHeader;

