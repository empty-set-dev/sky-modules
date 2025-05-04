import cn from 'pkgs/classnames'

import './Container.scss'

export interface ContainerProps extends PropsWithChildren {
    className?: string
    fluid?: boolean
}
export default function Container(props: ContainerProps): ReactNode {
    return (
        <div
            className={cn(
                'Container',
                {
                    fluid: !!props.fluid,
                },
                props.className
            )}
        >
            {props.children}
        </div>
    )
}
