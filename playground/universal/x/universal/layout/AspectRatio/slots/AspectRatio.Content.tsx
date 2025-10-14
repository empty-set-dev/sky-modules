import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'
import '@sky-modules/universal/SlotRoot/global'

import * as React from 'react';

export type AspectRatioContentProps<T extends BoxAs = 'div'> = Design.SlotProps<T> & {
inputRef?: unknown;
}

  import  clsx from 'clsx';

  function AspectRatioContent<T extends BoxAs = 'div'>(props:AspectRatioContentProps<T>, inputRef?: unknown) {


    // Preserved local variables (added by local-vars-plugin)
  const restProps = (({ , ...rest }) => rest)(props);
  const root = useSlotRoot();

return (

<Box  ref={inputRef}  {...(restProps)}  as={as ?? 'div'}  sx={clsx(props.sx, root.styles.content)}><Box>{props.children}</Box></Box>

);
}

  export default forwardRef(AspectRatioContent) as typeof AspectRatioContent

