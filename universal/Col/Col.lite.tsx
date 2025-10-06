import '@sky-modules/design/Box.global'
import '@sky-modules/design/Design.namespace'

import clsx from 'clsx'

import { colRecipe } from './Col.recipe.lite'

export type ColProps<T extends BoxAs = 'div'> = Design.SlotProps<T, typeof colRecipe> & {
    inputRef?: unknown
}

export default function Col<T extends BoxAs = 'div'>(props: ColProps<T>): Mitosis.Node {
    const {
        span,
        offset,
        order,
        flex,
        push,
        pull,
        xs,
        sm,
        md,
        lg,
        xl,
        unstyled,
        recipe,
        as,
        ...restProps
    } = props
    const styles =
        recipe ??
        colRecipe({
            span,
            offset,
            order,
            flex,
            push,
            pull,
            xs,
            sm,
            md,
            lg,
            xl,
        })
    return (
        <Box
            ref={props.inputRef}
            {...restProps}
            as={as ?? 'div'}
            sx={clsx(props.sx, unstyled || styles)}
        >
            {props.children}
        </Box>
    )
}
