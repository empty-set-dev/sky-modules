import * as React from 'react';

import { forwardRef } from 'react'

  import  clsx from 'clsx';
import  { linkRecipe } from './Link.recipe.js';

  const Link = forwardRef<Design.SlotProps<T, typeof linkRecipe>["inputRef"]>(function Link(props:Design.SlotProps<T, typeof linkRecipe>,inputRef) {

    // Preserved local variables (added by local-vars-plugin)
  const underline = props.underline;
  const subtle = props.subtle;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ underline, subtle, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ?? linkRecipe({ underline, subtle });

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'a' as T}  sx={clsx(props.sx, unstyled || styles)}>{props.children}</Box>

);
})

  export default Link;

