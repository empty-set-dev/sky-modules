'use client';
import * as React from 'react';

import { useRef } from 'react'

  import  clsx from 'clsx';
import  { buttonRecipe } from './Button.recipe.js';

  function Button(props:Design.SlotProps<T, typeof buttonRecipe>) {

    // Preserved local variables (added by local-vars-plugin)
  const variant = props.variant;
  const size = props.size;
  const disabled = props.disabled;
  const loading = props.loading;
  const unstyled = props.unstyled;
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ variant, size, disabled, loading, unstyled, recipe, as, ...rest }) => rest)(props);
  const styles = recipe ?? buttonRecipe({ variant, size, disabled, loading });

const buttonRef = useRef(null);

return (

<Box  ref={buttonRef}  {...(restProps)}  as={as ?? 'button' as T}  disabled={disabled}  sx={clsx(props.sx, unstyled || styles)}>{loading ? (
<span className="button__loading">⏳</span>
) : null}{props.children}</Box>

);
}

  export default Button;

