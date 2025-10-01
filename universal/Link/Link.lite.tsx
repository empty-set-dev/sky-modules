import '@sky-modules/react/Box.global'
import '@sky-modules/design/DesignSystem'

import { useRef, useStore } from '@builder.io/mitosis'
import clsx from 'clsx'

import getBoxProps from './Link.props.lite'
import { LinkSx } from './Link.style.lite'

export default function Link<T extends TagName = 'div'>(
    props: DesignSystem.SlotProps<T, typeof LinkSx>
): Mitosis.Node {
    const { sx, boxProps } = useStore({
        boxProps: getBoxProps(props),
        sx: LinkSx(props),
    })
    const inputRef = useRef<HTMLElement>(null)

    return (
        <Box ref={inputRef} {...boxProps} as={boxProps.as} sx={clsx(sx, props.sx)}>
            {props.children}
        </Box>
    )
}
