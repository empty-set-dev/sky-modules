import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import * as React from 'react';

export type AspectRatioProps<T extends BoxAs = 'div'> = BoxProps<T> & {
inputRef?: unknown;
aspectRatio?: number;
}

  function AspectRatio<T extends BoxAs = 'div'>(props:AspectRatioProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const aspectRatio = props.aspectRatio;
  const boxProps = (({ aspectRatio, ...rest }) => rest)(props);

return (

  <Box  {...(boxProps)}  ref={inputRef}  style={{
aspectRatio: aspectRatio ?? 1
}}>{props.children}</Box>

);
}

  export default forwardRef(AspectRatio) as typeof AspectRatio

