import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import '@sky-modules/universal/SlotRoot/global'

import * as React from 'react';

export type AspectRatioRootProps<T extends BoxAs = 'div'> = Design.SlotRootProps<T, typeof aspectRatioRecipe> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';
import  { aspectRatioRecipe } from './AspectRatio.recipe';

  function AspectRatioRoot<T extends BoxAs = 'div'>(props:AspectRatioRootProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const recipe = props.recipe;
  const as = props.as;
  const restProps = (({ recipe, as, ...rest }) => rest)(props);
  const styles = unstyled || (recipe ?? aspectRatioRecipe());
  const rootStyles = styles?.root();

return (

<SlotRootProvider  styles={styles}><Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div'}  sx={clsx(props.sx, rootStyles)}>{props.children}</Box></SlotRootProvider>

);
}

  export default forwardRef(AspectRatioRoot) as typeof AspectRatioRoot

