import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

export type AspectRatioProps<T extends BoxAs = 'div'> = BoxProps<T> & {
    inputRef?: unknown
    aspectRatio?: number
}
export default function AspectRatio<T extends BoxAs = 'div'>(
    props: AspectRatioProps<T>
): Mitosis.Node {
    const { aspectRatio, ...boxProps } = props
    return (
        //@ts-expect-error style
        <Box {...boxProps} ref={props.inputRef} style={{ aspectRatio: aspectRatio ?? 1 }}>
            {props.children}
        </Box>
    )
}
