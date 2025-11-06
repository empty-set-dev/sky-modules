import { Show } from 'solid-js';

    export interface PopoverProps {
controller: PopoverController;
trigger: Mitosis.Node;
children?: Mitosis.Children;
}

    import  PopoverController from './PopoverController';

    function Popover(props:PopoverProps) {

            // Preserved local variables (added by local-vars-plugin)
    const controller = props.controller;
    const trigger = props.trigger;
    const children = props.children;

return (<>
            <><Box  ref={controller.triggerRef!}  onClick={(event) => controller.toggle()}  asChild={true} >{trigger}</Box>
<Show  when={controller.isOpen} ><Box  ref={controller.popoverRef!}  sx={`absolute z-50`} >{children}
<Box  sx="absolute w-2 h-2 bg-white border-l border-t border-gray-200 rotate-45"  ref={controller.arrowRef!} ></Box></Box></Show></>

            </>)
    }

    export default Popover;
