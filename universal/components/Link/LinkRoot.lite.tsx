import { useRef, useStore, useContext } from '@builder.io/mitosis'
import { cx } from '@sky-modules/helpers/cn'

import { SlotRootContext } from '../../SlotRoot/index.lite'

export default function LinkRoot<T extends keyof HTMLElementTagNameMap = 'div'>(
    props: BoxProps<T>
): Mitosis.Node {
    const { boxProps } = useStore({
        boxProps: getBoxProps(props),
    })
    const inputRef = useRef<HTMLElement>(null)
    const root = useContext(SlotRootContext)

    return (
        <Box ref={inputRef} {...boxProps} sx={cx(root.sx.root, props.sx)}>
            {props.children}
        </Box>
    )
}
