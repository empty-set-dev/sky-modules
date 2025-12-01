import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Text.lite.css'

import clsx from 'clsx'

import { textRecipe } from './Text.recipe.lite'

/**
 * Props for Text component
 *
 * @template T - Element type (default: 'p')
 */
export type TextProps<T extends BoxAs = 'p'> = Design.SlotRootProps<typeof textRecipe, T> & {
    /** Ref to the text element */
    inputRef?: unknown
    /** Number of lines to display before truncating */
    noOfLines?: number
}

/**
 * Text component with Panda CSS styling
 *
 * Polymorphic text component with support for sizing, alignment, casing,
 * decoration, truncation, and line clamping.
 *
 * Compiled to all frameworks via Mitosis.
 *
 * @template T - Element type (default: 'p')
 * @param props - Component props
 * @returns Mitosis node
 *
 * @example Basic usage
 * ```tsx
 * import Text from '@sky-modules/universal/typegraphy/Text'
 *
 * <Text>This is a paragraph</Text>
 * ```
 *
 * @example With sizing and alignment
 * ```tsx
 * <Text size="lg" align="center">
 *   Large centered text
 * </Text>
 * ```
 *
 * @example Line clamping
 * ```tsx
 * <Text noOfLines={3}>
 *   Long text that will be truncated after 3 lines with ellipsis...
 * </Text>
 * ```
 *
 * @example As different element
 * ```tsx
 * <Text as="span" decoration="underline">
 *   Inline underlined text
 * </Text>
 * ```
 *
 * @example Global usage
 * ```tsx
 * import '@sky-modules/universal/typegraphy/Text/global'
 *
 * <Text>Available globally</Text>
 * ```
 */
export default function Text<T extends BoxAs = 'p'>(props: TextProps<T>): Mitosis.Node {
    const {
        size,
        align,
        casing,
        decoration,
        truncate,
        noWrap,
        noOfLines,
        inputRef,
        unstyled,
        recipe,
        sx,
        ...boxProps
    } = props

    const styles =
        unstyled ||
        (recipe ??
            textRecipe({
                size,
                align,
                casing,
                decoration,
                truncate,
                noWrap,
            }))

    const lineClampStyles = noOfLines
        ? {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: noOfLines,
          }
        : undefined

    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)} style={lineClampStyles}>
            {props.children}
        </Box>
    )
}
