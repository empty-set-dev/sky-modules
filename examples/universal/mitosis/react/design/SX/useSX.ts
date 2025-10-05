import { SXContext, SXContextType } from './index.js';
export default function useSX(): SXContextType {
  return useContext(SXContext) as SXContextType;
}