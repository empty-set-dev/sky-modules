import cn from 'pkgs/classnames'

import './Container.scss'
import usePageContext from 'sky/platform/web/renderer/usePageContext'

export interface ContainerProps extends PropsWithChildren {
    className?: string
    fluid?: boolean
}
export default function Container(props: ContainerProps) {
    const { theme } = usePageContext()

    return (
        <div
            className={cn('Container', theme, {
                fluid: !!props.fluid,
            }, props.className)}
        >
            {props.children}
        </div>
    )
}
