import { SlotRootContext, SlotRootContextType } from './index';
export default function useSlotRoot(): SlotRootContextType {
  return useContext(SlotRootContext);
}