import * as React from 'react';

  export interface PopoverProps {
this: PopoverType;
trigger: Mitosis.Node;
children?: Mitosis.Children;
}

  import  { PopoverType } from './types';

  function Popover(props:PopoverProps) {

    // Preserved local variables (added by local-vars-plugin)
  const self = props.this;
  const trigger = props.trigger;
  const children = props.children;

return (

<><Box  ref={self.triggerRef}  onClick={(event) => self.toggle() }  asChild>{trigger}</Box>
{self.isOpen ? (
<Box  ref={self.popoverRef}  sx={`absolute z-50`}>{children}<Box  sx="absolute w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"  ref={self.arrowRef}  /></Box>
) : null}</>

);
}

  export default Popover;

