import '@sky-modules/design/Box/global'
import '@sky-modules/design/Design/namespace'

import './Col.lite.css'

import clsx from 'clsx'

import { colRecipe } from './Col.recipe.lite'

export type ColProps<T extends BoxAs = 'div'> = Design.SlotRootProps<typeof colRecipe, T> & {
    inputRef?: unknown
}

export default function Col<T extends BoxAs = 'div'>(props: ColProps<T>): Mitosis.Node {
    const {
        span,
        offset,
        push,
        pull,
        xs,
        sm,
        md,
        lg,
        xl,

        inputRef,
        unstyled,
        recipe,
        sx,
        ...boxProps
    } = props
    const styles =
        unstyled ||
        (recipe ??
            colRecipe({
                span,
                offset,
                push,
                pull,
                xs,
                sm,
                md,
                lg,
                xl,
            }))
    return (
        <Box {...boxProps} ref={inputRef} sx={clsx(sx, styles)}>
            {props.children}
        </Box>
    )
}
