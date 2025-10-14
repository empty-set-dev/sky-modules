import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import * as React from 'react';

export type AspectRatioProps<T extends BoxAs = 'div'> = BoxProps<T> & {
inputRef?: unknown;
}

  function AspectRatio<T extends BoxAs = 'div'>(props:AspectRatioProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const as = props.as;
  const restProps = (({ as, ...rest }) => rest)(props);

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div'}  sx={props.sx}>{props.children}</Box>

);
}

  export default forwardRef(AspectRatio) as typeof AspectRatio

