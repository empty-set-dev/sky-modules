import SlotRootContext from './SlotRoot.context';
import { SlotRootContextType } from './types';
export default function useSlotRoot(): SlotRootContextType {
  return useContext(SlotRootContext);
}