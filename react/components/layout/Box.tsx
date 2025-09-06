iAm('Box', import('./Box'))

declare global {
    interface Modules {
        Box: typeof import('./Box')
    }
}

export interface BoxProps {}
export default function Box(props: BoxProps) {
    return <>Hello, world!</>
}
