import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

export type AspectRatioProps<T extends BoxAs = 'div'> = BoxProps<T> & {
    inputRef?: unknown
}

export default function AspectRatio<T extends BoxAs = 'div'>(
    props: AspectRatioProps<T>
): Mitosis.Node {
    const { as, ...restProps } = props

    return (
        <Box ref={props.inputRef} {...restProps} as={as ?? 'div'} sx={props.sx}>
            {props.children}
        </Box>
    )
}
