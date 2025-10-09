import { SXContext, SXContextType } from './index';
export default function useSX(): SXContextType {
  return useContext(SXContext) as SXContextType;
}