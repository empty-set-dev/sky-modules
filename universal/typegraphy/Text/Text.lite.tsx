import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Text.lite.css'

import clsx from 'clsx'

import { textRecipe } from './Text.recipe.lite'

export type TextProps<T extends BoxAs = 'p'> = Design.SlotRootProps<typeof textRecipe, T> & {
    inputRef?: unknown
    noOfLines?: number
}

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
