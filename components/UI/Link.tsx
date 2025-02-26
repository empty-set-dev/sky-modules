import classNames from 'classnames'

import usePageContext from '#/renderer/usePageContext'

export default function Link(props: {
    href: string
    className?: string
    children: React.ReactNode
}): ReactNode {
    const pageContext = usePageContext()
    const { urlPathname } = pageContext
    let href: string

    if (props.href.startsWith('/')) {
        if (props.href === '/' && pageContext.lngPrefix !== '') {
            href = pageContext.lngPrefix
        } else {
            href = `${pageContext.lngPrefix}${props.href}`
        }
    } else {
        href = props.href
    }

    const isActive = href === '/' ? urlPathname === href : urlPathname.startsWith(href)
    const className = classNames(props.className, isActive && 'is-active')

    return <a {...props} href={href} className={className} />
}
