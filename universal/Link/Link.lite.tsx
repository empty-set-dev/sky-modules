import '@sky-modules/react/Box.global'
import '@sky-modules/design/DesignSystem'
import '@sky-modules/jsx/global'

import { useRef, useStore } from '@builder.io/mitosis'
import clsx from 'clsx'

import { extractBoxProps } from './Link.props.lite'
import linkStyles from './Link.styles.lite'

export default function Link<T extends BoxAs = 'a'>(
    props: DesignSystem.SlotProps<T, typeof linkStyles, void>
): Mitosis.Node {
    const { sx, boxProps } = useStore({
        boxProps: extractBoxProps<T>(props),
        sx: linkStyles(props),
    })
    const inputRef = useRef(null)

    return (
        <Box ref={inputRef} {...boxProps} as={(boxProps.as ?? 'a') as T} sx={clsx(sx, props.sx)}>
            {props.children}
        </Box>
    )
}
