import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import * as React from 'react';

export type LayoutProps<T extends TagName = 'div'> = Design.SlotProps<typeof layoutRecipe, T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  LayoutHeader from './Layout.Header/Layout.Header';
import  { layoutRecipe } from './Layout.recipe';
import  LayoutRoot from './Layout.Root/Layout.Root';

  function Layout<T extends TagName = 'div'>(props:LayoutProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const fullHeight = props.fullHeight;
  const fullWidth = props.fullWidth;
  const overflow = props.overflow;
  const direction = props.direction;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ fullHeight, fullWidth, overflow, direction, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ??
        layoutRootRecipe({
            // variant,
            fullHeight,
            fullWidth,
            overflow,
            direction,
        });

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}
Layout.Header = LayoutHeader;
Layout.Root = LayoutRoot;



  export default React.forwardRef(Layout) as typeof Layout

