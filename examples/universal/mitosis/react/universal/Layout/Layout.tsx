'use client';
import * as React from 'react';

import { useRef } from 'react'

  type LayoutProps = Design.SlotProps<T, typeof layoutRecipe> & {
rootProps?: unknown;
showHeader?: boolean;
headerProps?: unknown;
}

  import  clsx from 'clsx';
import  LayoutHeader from './Layout.Header.js';
import  { layoutRecipe } from './Layout.recipe.js';
import  LayoutRoot from './Layout.Root.js';

  function Layout(props:LayoutProps) {

    // Preserved local variables (added by local-vars-plugin)
  const variant = props.variant;
  const header = props.header;
  const footer = props.footer;
  const sidebar = props.sidebar;
  const aside = props.aside;
  const fullHeight = props.fullHeight;
  const headerProps = props.headerProps;
  const rootProps = props.rootProps;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ variant, header, footer, sidebar, aside, fullHeight, headerProps, rootProps, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ??
        layoutRecipe({;

const inputRef = useRef(null);

return (

<LayoutRoot  ref={inputRef}  fullHeight={fullHeight}>{showHeader ? (
<LayoutHeader  />
) : null}<Box  {...(restProps)}  as={as ?? 'main' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box></LayoutRoot>

);
}

  export default Layout;

