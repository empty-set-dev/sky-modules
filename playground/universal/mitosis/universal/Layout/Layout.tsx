import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import * as React from 'react';

export type LayoutProps<T extends TagName = 'div'> = Design.SlotProps<T, typeof layoutRecipe> & {
inputRef?: unknown;
rootProps?: unknown;
showHeader?: boolean;
headerProps?: unknown;
}

  import  clsx from 'clsx';
import  LayoutHeader from './Layout.Header';
import  { layoutRecipe } from './Layout.recipe';
import  LayoutRoot from './Layout.Root';

  function Layout<T extends TagName = 'div'>(props:LayoutProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const variant = props.variant;
  const header = props.header;
  const footer = props.footer;
  const sidebar = props.sidebar;
  const aside = props.aside;
  const fullHeight = props.fullHeight;
  const headerProps = props.headerProps;
  const rootProps = props.rootProps;
  const showHeader = props.showHeader;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ variant, header, footer, sidebar, aside, fullHeight, headerProps, rootProps, showHeader, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ??
        layoutRecipe({
            variant,
            header,
            footer,
            sidebar,
            aside,
            fullHeight,
        });

return (

<LayoutRoot  ref={inputRef}  fullHeight={fullHeight}>{showHeader ? (
<LayoutHeader  />
) : null}<Box  {...(restProps)}  as={as ?? 'main' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box></LayoutRoot>

);
}

  export default forwardRef(Layout) as typeof Layout

