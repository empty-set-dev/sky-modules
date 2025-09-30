import { SlotRootContext, SlotRootContextType } from './index.js';
export default function useSlotRoot(): SlotRootContextType {
  return useContext(SlotRootContext);
}