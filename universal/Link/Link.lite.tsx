import '@sky-modules/react/Box.global'
import '@sky-modules/design/DesignSystem'
import '@sky-modules/jsx/global'

import { useRef, useStore } from '@builder.io/mitosis'
import clsx from 'clsx'

import getBoxProps from './Link.props.lite'
import { link } from './Link.style.lite'

export default function Link<T extends BoxAs = 'div'>(
    props: DesignSystem.SlotProps<T, typeof LinkStyle>
): Mitosis.Node {
    const { sx, boxProps } = useStore({
        boxProps: getBoxProps<T>(props),
        sx: LinkStyle(props),
    })
    const inputRef = useRef(null)
    return (
        <Box ref={inputRef} {...boxProps} as={(boxProps.as ?? 'a') as T} sx={clsx(sx, props.sx)}>
            {props.children}
        </Box>
    )
}
