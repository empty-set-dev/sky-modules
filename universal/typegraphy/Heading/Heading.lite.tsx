import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Heading.lite.css'

import clsx from 'clsx'

import { headingRecipe } from './Heading.recipe.lite'

export type HeadingProps<T extends BoxAs = 'h2'> = Design.SlotRootProps<typeof headingRecipe, T> & {
    inputRef?: unknown
}

export default function Heading<T extends BoxAs = 'h2'>(props: HeadingProps<T>): Mitosis.Node {
    const { size, inputRef, unstyled, recipe, sx, ...boxProps } = props

    const styles = unstyled || (recipe ?? headingRecipe({ size }))

    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)}>
            {props.children}
        </Box>
    )
}
