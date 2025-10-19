export interface SlotRootProviderProps {
children?: Mitosis.Children;
styles?: SlotRootStyles;
controller?: SlotRootController;
}

  import  SlotRootContext from './SlotRoot.context';
import  { SlotRootController, SlotRootStyles } from './types';

  function SlotRootProvider(props:SlotRootProviderProps) {

      // Preserved local variables (added by local-vars-plugin)
  const context = { ...(props.styles ? { styles: props.styles } : {}), ...(props.controller ? { controller: props.controller } : {}) };

return (<>
      <SlotRootContext.Provider  value={context} ><>{props.children}</></SlotRootContext.Provider>

      </>)
  }

  export default SlotRootProvider;
