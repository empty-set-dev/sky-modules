import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

export type AspectRatioProps<T extends BoxAs = 'div'> = BoxProps<T> & {
    inputRef?: unknown
    aspectRatio?: number
}

export default function AspectRatio<T extends BoxAs = 'div'>(
    props: AspectRatioProps<T>
): Mitosis.Node {
    const { inputRef, aspectRatio, as, ...boxProps } = props

    return (
        <Box
            {...(boxProps as BoxProps<T>)}
            ref={inputRef}
            as={as ?? 'div'}
            style={{ aspectRatio: aspectRatio ?? 1 }}
        >
            {props.children}
        </Box>
    )
}
