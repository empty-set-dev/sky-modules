import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import * as React from 'react';

import  clsx from 'clsx';
import  { buttonRecipe } from './Button.recipe';

  function Button<T extends BoxAs = 'button'>(props:Design.SlotProps<T, typeof buttonRecipe>, inputRef?: unknown) {


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

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'button'}  disabled={disabled}  sx={clsx(props.sx, unstyled || styles)}>{loading ? (
<span className="button__loading">⏳</span>
) : null}{props.children}</Box>

);
}

  export default forwardRef(Button) as typeof Button

