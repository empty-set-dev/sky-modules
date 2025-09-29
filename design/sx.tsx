import cn from '@sky-modules/helpers/cn'
import HTML_TAGS from '@sky-modules/web/HTML_TAGS'
import { ClassValue } from 'clsx'

import type { JSX } from 'react'

const sx = sxWith(cx)
export default sx

export type Sx<T extends keyof JSX.IntrinsicElements> = (
    sx: string | TemplateStringsArray,
    ...args: ClassValue[]
) => (props: BoxProps<T>) => ReactNode

export function sxWith<T extends keyof JSX.IntrinsicElements>(
    styles: Record<string, string> | Cx
): Sx<T> & Record<keyof HTMLElementTagNameMap, Sx<T>> {
    let cx = typeof styles === 'object' ? cn(styles) : styles

    function commonSx(
        tag: keyof HTMLElementTagNameMap,
        sx: string | TemplateStringsArray,
        ...args: ClassValue[]
    ): (props: BoxProps<T>) => ReactNode {
        sx = cx(sx, ...args)
        return function Styled(props: BoxProps<T>): ReactNode {
            const { sx: currentSx, ...otherProps } = props
            const finalSX = currentSx ? cx(sx, currentSx) : sx
            return <Box as={tag} {...otherProps} sx={finalSX} />
        }
    }

    function createSxAs(
        tag: keyof HTMLElementTagNameMap
    ): (
        sx: string | TemplateStringsArray,
        ...args: ClassValue[]
    ) => (props: BoxProps<T>) => ReactNode {
        return function sxAs(
            sx: string | TemplateStringsArray,
            ...args: ClassValue[]
        ): (props: BoxProps<T>) => ReactNode {
            return commonSx(tag, sx, ...args)
        }
    }

    const sx = function sx(
        sx: string | TemplateStringsArray,
        ...args: ClassValue[]
    ): (props: BoxProps<T>) => ReactNode {
        return commonSx('div', sx, ...args)
    }
    as<Sx<T> & Record<keyof HTMLElementTagNameMap, Sx<T>>>(sx)

    for (const tag of HTML_TAGS) {
        as<keyof HTMLElementTagNameMap>(tag)
        sx[tag] = createSxAs(tag)
    }

    return sx
}
