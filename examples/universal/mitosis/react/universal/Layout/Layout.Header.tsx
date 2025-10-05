'use client';
import * as React from 'react';

import { useRef } from 'react'

  import  clsx from 'clsx';
import  { layoutHeaderRecipe } from './Layout.Header.recipe.js';

  function LayoutHeader(props:Design.SlotProps<T, typeof layoutHeaderRecipe>) {

  const headerRef = useRef(null);

return (

<Box  ref={headerRef}  {...(restProps)}  as={as ?? 'header' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default LayoutHeader;

