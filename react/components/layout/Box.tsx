import { CSSProperties, HTMLAttributes } from 'react'

iAm('Box', import('./Box'))

declare global {
    interface Modules {
        Box: typeof import('./Box')
    }
}

export interface BoxProps extends HTMLAttributes<HTMLElement> {
    className?: string

    aspect: number | string
}
export default function Box(props: BoxProps): ReactNode {
    return <div>Hello, world!</div>
}

function foo() {
    return (
        <Box
            aspectRatio="18/24"
            className={cx(`
                aspect-[18/24]
            `)}
        ></Box>
    )
}
