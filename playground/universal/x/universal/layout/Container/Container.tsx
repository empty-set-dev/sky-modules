import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import * as React from 'react';

export type ContainerProps<T extends BoxAs = 'div'> = Design.SlotProps<T, typeof containerRecipe> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { containerRecipe } from './Container.recipe';

  function Container<T extends BoxAs = 'div'>(props:ContainerProps<T>, inputRef?: unknown) {


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
            fluid,
        });

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div'}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
}

  export default forwardRef(Container) as typeof Container

