import { PageContext } from 'vike/types'

import usePageContext from 'sky/platform/web/renderer/usePageContext'

export default function useIp(): string {
    const pageContext = usePageContext() as PageContext
    return pageContext.initial.ip
}
