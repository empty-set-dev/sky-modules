import { PageContext } from 'vike/types'

import usePageContext from '../../../_examples/pkgs/@artsy/fresnel/renderer/usePageContext'

export default function useIp(): string {
    const pageContext = usePageContext() as PageContext
    return pageContext.initial.ip
}
