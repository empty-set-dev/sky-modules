import { useContext } from '@builder.io/mitosis'

import { SXContext, SXContextType } from './index.lite'

export default function useSX(): SXContextType {
    return useContext(SXContext) as SXContextType
}
