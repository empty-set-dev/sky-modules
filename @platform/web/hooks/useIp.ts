import { PageContext } from 'vike/types'

import usePageContext from '#/renderer/usePageContext'

export default function useIp(): string {
    const pageContext = usePageContext() as PageContext
    return pageContext.initial.ip
}
