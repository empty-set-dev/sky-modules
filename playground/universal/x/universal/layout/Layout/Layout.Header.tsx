import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import * as React from 'react';

export type LayoutHeaderProps<T extends TagName = 'header'> = Design.SlotProps<T, typeof layoutHeaderRecipe> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { layoutHeaderRecipe } from './Layout.Header.recipe';

  function LayoutHeader<T extends TagName = 'header'>(props:LayoutHeaderProps<T>, inputRef?: unknown) {


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

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'header' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default forwardRef(LayoutHeader) as typeof LayoutHeader

