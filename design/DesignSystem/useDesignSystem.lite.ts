import { useContext } from '@builder.io/mitosis'

import { DesignSystemContext, DesignSystemContextType } from './index.lite'

export default function useDesignSystem(): DesignSystemContextType {
    return useContext(DesignSystemContext) as DesignSystemContextType
}
