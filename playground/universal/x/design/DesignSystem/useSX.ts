import { DesignSystemContext, DesignSystemContextType } from './index';
export default function useDesignSystem(): DesignSystemContextType {
  return useContext(DesignSystemContext) as DesignSystemContextType;
}