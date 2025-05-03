import cn from 'pkgs/classnames'

export interface ContainerProps extends PropsWithChildren {
    className?: string
    fluid?: boolean
}
export default function Container(props: ContainerProps) {

    return (
        <div
            className={`Container ${props.className}`}
        >
            {props.children}
        </div>
    )
}
