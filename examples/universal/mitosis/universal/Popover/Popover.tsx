import * as React from 'react';

  export interface PopoverProps {
popover: PopoverType;
trigger: Mitosis.Node;
children?: Mitosis.Children;
}

  import  { PopoverType } from './types.js';

  function Popover(props:PopoverProps) {

    // Preserved local variables (added by local-vars-plugin)
  const popover = props.popover;
  const trigger = props.trigger;
  const children = props.children;

return (

<><Box  ref={popover.triggerRef}  onClick={(event) => popover.toggle() }  asChild>{trigger}</Box>
{popover.isOpen ? (
<Box  ref={popover.popoverRef}  sx={`absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-3`}>{children}<Box  sx="absolute w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"  ref={popover.arrowRef}  /></Box>
) : null}</>

);
}

  export default Popover;

