import SXContext from './SX.context';
import { SXContextType } from './types';
export default function useSXContext(): SXContextType {
  return useContext(SXContext);
}