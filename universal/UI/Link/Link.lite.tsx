import '@sky-modules/react/Box.global'
import '@sky-modules/design/DesignSystem'

import { useRef, useStore } from '@builder.io/mitosis'
import { tv } from 'tailwind-variants'

import { SlotRootProvider } from '../../SlotRoot/index.lite'

import LinkRoot from './LinkRoot.lite'
import LinkSub from './LinkSub.lite'

const LinkSx = tv({
    slots: {
        root: 'bg-red-400',
        sub: 'bg-amber-600',
    },
    variants: {
        underline: {
            true: {
                sub: 'underline',
            },
        },
    },
})

export default function Link<T extends keyof HTMLElementTagNameMap = 'div'>(
    props: DesignSystem.SlotProps<T, typeof LinkSx>
): Mitosis.Node {
    const { sx, boxProps } = useStore({
        sx: LinkSx(props),
        boxProps: getBoxProps(props),
    })
    const inputRef = useRef<HTMLElement>(null)

    return (
        <SlotRootProvider
            sx={{
                root: sx.root(props),
                sub: sx.sub(props),
            }}
            store={{}}
        >
            <LinkRoot ref={inputRef} {...boxProps}>
                <LinkSub>sub</LinkSub>
                {props.children}
            </LinkRoot>
        </SlotRootProvider>
    )
}
