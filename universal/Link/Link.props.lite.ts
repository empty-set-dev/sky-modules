import link from './Link.style.lite'

export default function getBoxProps<T extends BoxAs = 'div'>(
    props: DesignSystem.SlotProps<T, typeof link>
): BoxProps<T> {
    const { underline, ...boxProps } = props
    underline
    return boxProps as BoxProps<T>
}
 